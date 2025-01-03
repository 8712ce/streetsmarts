import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './signIn.css';

function SignIn({ onLogInSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/users/login', {
                email,
                password
            });

            // IF LOGIN SUCCESSFUL, THE SERVER RETURNS { token, user: foundUser }
            const { token, user } = response.data
            console.log('Logged in successfully:', user);

            // OPTIONALLY STORE THE TOKEN IN LOCALSTORAGE OR CONTEXT //
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user._id);
            localStorage.setItem('userEmail', user.email);

            setLoading(false);

            // IF THE PARENT OR SOME GLOBAL CONTEXT WANTS TO HANDLE POST-LOGIN: //
            if (onLogInSuccess) {
                onLogInSuccess({ token, user })
            }

            navigate('/menu');
        } catch (err) {
            setLoading(false);
            console.error('Login failed:', err)
            if (err.response && err.response.status === 401) {
                setError('Invalid email or password')
            } else {
                setError('Something went wrong.  Please try again.')
            }
        }
    };

    return (
        <div className='sign_in_container'>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className='sign_in_form'>
                    <label>Email:</label>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className='sign_in_form'>
                    <label>Password:</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type='submit' disabled={loading}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
            </form>

            {error && (
                <div className='sign_in_error'>{error}</div>
            )}

            <p>
                Don't have an account?{' '}
                <Link to='/signup'>Sign Up Here</Link>
            </p>
        </div>
    )
};

export default SignIn