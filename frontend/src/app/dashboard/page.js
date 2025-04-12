"use client";
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css'

const Dashboard = () => {
    const [seats, setSeats] = useState([]);
    const [seatCount, setSeatCount] = useState(0);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const token = localStorage.getItem('authToken');

                if (!token) {
                    router.push('/login')
                    return;
                }
                const response = await axios.get("http://localhost:5000/booking/seats", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setSeats(response.data);
                setLoading(false);
            }

            catch (err) {
                console.error("Error fetching seats:", err);
            }
        }
        fetchSeats();
    }, [seats]);

    const bookSeats = () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            router.push('/login');
            return;
        }
        if (seatCount < 1 || seatCount > 7) {
            setErrorMessage('Please choose between 1 and 7 seats.');
            return;
        }

        setErrorMessage('');

        axios.post('/booking/book', { seatCount }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setMessage(`Booked seat(s): ${res.data.seatIds.join(', ')}`);
            })
            .catch(err => {
                setMessage(err.response.data.message);
            });
    };

    const sortedSeats = [...seats].sort((a, b) => {
        if (a.row_number === b.row_number) {
            return a.seat_number - b.seat_number;
        }
        return a.row_number - b.row_number;
    });

    const groupedRows = sortedSeats.reduce((acc, seat) => {
        const row = seat.row_number;
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {});

    const handleReset = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Toknnnnn', token)
            const response = await axios.post('/booking/reset',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        } catch (error) {
            console.error('Reset failed:', error);
            alert('Failed to reset seats');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div>
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                <button className="btn btn-primary" onClick={handleReset} style={{ marginTop: '20px' }}>
                    Reset All Seats
                </button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <div>
                    {Object.entries(groupedRows).map(([rowNum, rowSeats]) => (
                        <div key={rowNum} style={{ marginBottom: '10px' }}>
                            {rowSeats.map(seat => (
                                <span
                                    key={seat.seat_number}
                                    style={{
                                        padding: '5px 10px',
                                        margin: '0 3px',
                                        display: 'inline-block',
                                        width: '40px',
                                        color: 'black',
                                        backgroundColor: seat.is_booked ? 'tomato' : 'lightgreen',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {seat.id}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
                <input className="form-control" type="number" value={seatCount} min={1} max={7} onChange={e => setSeatCount(e.target.value)} />
                <div className={styles.booking}>
                    <button className="btn btn-primary" onClick={bookSeats}>Book</button>
                    <p>{message}</p>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
