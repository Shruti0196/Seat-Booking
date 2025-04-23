"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            username,
            password,
        };

        try {
            console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Login successful!');
                localStorage.setItem('authToken', result.token);
                router.push('/dashboard');
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
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
