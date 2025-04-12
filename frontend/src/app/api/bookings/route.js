// // app/api/bookings/route.js
// import pool from '@/lib/db';

// export async function GET() {
//     try {
//         const result = await pool.query('SELECT * FROM bookings');
//         return Response.json(result.rows);
//     } catch (error) {
//         console.error(error);
//         return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
//     }
// }

// export async function POST(req) {
//     const body = await req.json();
//     const { username, seat_number } = body;

//     if (!username || !seat_number) {
//         return Response.json({ error: 'Username and seat number are required' }, { status: 400 });
//     }

//     try {
//         await pool.query(
//             'INSERT INTO bookings (username, seat_number) VALUES ($1, $2)',
//             [username, seat_number]
//         );

//         return Response.json({ message: 'Booking successful' }, { status: 201 });
//     } catch (error) {
//         console.error(error);
//         return Response.json({ error: 'Database error' }, { status: 500 });
//     }
// }
