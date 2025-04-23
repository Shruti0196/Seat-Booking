"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username,
            email,
            password,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('User registered successfully!');
                router.push('/login')
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('An error occurred');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Sign Up</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
