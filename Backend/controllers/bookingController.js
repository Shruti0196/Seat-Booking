import pool from '../models/db.js';

// Fetch all seats from the database ordered by seat_number
export const getSeats = async (req, res) => {
    const result = await pool.query('SELECT * FROM seats ORDER BY seat_number');
    const seats = result.rows;
    res.json(seats);
};

export const book = async (req, res) => {
    const { seatCount } = req.body;
    const userId = req.user.userId;

    try {
        const { rows: allSeats } = await pool.query(
            'SELECT * FROM seats ORDER BY row_number, seat_number'
        );

        // Organize seats by rows
        const rows = {};
        for (const seat of allSeats) {
            if (!rows[seat.row_number]) rows[seat.row_number] = [];
            rows[seat.row_number].push(seat);
        }

        // Find the seats to be booked by their ids
        for (const rowNum in rows) {
            const row = rows[rowNum];
            const availableSeats = row.filter(seat => !seat.is_booked);
            if (availableSeats.length >= seatCount) {
                const seatIdsToBook = availableSeats.slice(0, seatCount).map(s => s.id);
                await bookTheseSeats(seatIdsToBook, userId);
                return res.json({ message: 'Seats booked in single row', seatIds: seatIdsToBook });
            }
        }

        //Check if required seats are availabe or not
        const available = allSeats.filter(seat => !seat.is_booked).slice(0, seatCount);
        if (available.length < seatCount) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        //Book from the available seats
        const seatIdsToBook = available.map(s => s.id);
        await bookTheseSeats(seatIdsToBook, userId);
        return res.json({ message: 'Nearby seats booked', seatIds: seatIdsToBook });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error during booking' });
    }
};

const bookTheseSeats = async (seatIds, userId) => {
    for (const id of seatIds) {
        await pool.query(
            'UPDATE seats SET is_booked = TRUE, booked_by = $1 WHERE id = $2',
            [userId, id]
        );
    }
};

export const reset = async (req, res) => {
    try {
        await pool.query('UPDATE seats SET is_booked = FALSE, booked_by = NULL');
        res.status(200).json({ message: 'All seats have been reset' });
    } catch (err) {
        console.error('Error resetting seats:', err);
        res.status(500).json({ message: 'Failed to reset seats' });
    }
};