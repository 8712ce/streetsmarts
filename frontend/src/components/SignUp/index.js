import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { createStudent, createTeacher, fetchAllTeachers } from '../../utils/api';

import './signUp.css';

function SignUp() {
    const [accountType, setAccountType] = useState('student'); // OR TEACHER

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [screenName, setScreenName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');



    // FETCH ALL TEACHERS ONCE THE COMPONENT LOADS //
    useEffect(() => {
        if (accountType === 'student') {
            fetchAllTeachers()
            .then((allTeachers) => {
                setTeachers(allTeachers);
                // OPTIONALLY SET A DEFAULT SELECTED TEACHER //
                if (allTeachers.length > 0) {
                    setSelectedTeacherId(allTeachers[0]._id);
                }
            })
            .catch((err) => {
                console.error('Error fetching teachers:', err);
                // OPTIONALLY SET AN ERROR OR FALLBACK //
            });
        }
    }, [accountType]);



    async function handleSignUp(e) {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            // CREATE THE USER OBJECT IN /USERS/SIGNUP.  THIS RETURNS { USER, TOKEN } //
            const userRes = await axios.post('http://localhost:8000/users/signup', {
                email,
                password
            });
            const { user, token } = userRes.data;
            console.log('Created user:', user);

            // STORE TOKEN SO WE CAN USE AUTHORIZATION HEADER //
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user._id);

            // DEPENDING ON 'ACCOUNT TYPE', CREATE A TEACHER OR STUDENT.  PASS USER._ID PLUS THE NAME FIELDS. //
            let newProfile = null;

            if (accountType === 'teacher'){
                newProfile = await createTeacher({
                    firstName,
                    lastName,
                    screenName,
                    user: user._id
                });
                console.log('Created teacher:', newProfile);
            } else {
                newProfile = await createStudent({
                    firstName,
                    lastName,
                    screenName,
                    user: user._id,
                    teacher: selectedTeacherId
                });
                console.log('Created student:', newProfile);
            }

            setSuccessMessage(`Account created successfully as a ${accountType}!  You can now sign in.`);

            // CLEAR THE FORM //
            setAccountType('student');
            setFirstName('');
            setLastName('');
            setScreenName('');
            setEmail('');
            setPassword('');
            setSelectedTeacherId('');

        } catch (err) {
            console.error('Sign up failed:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    }



    return (
        <div className='signup_container'>
            <h2>Create Your Account</h2>

            <form onSubmit={handleSignUp}>
                <div className='role_select'>
                    <label>
                        <input type='radio' name='accountType' value='student' checked={accountType === 'student'} onChange={() => setAccountType('student')} />
                        Student
                    </label>

                    <label>
                        <input type='radio' name='accountType' value='teacher' checked={accountType === 'teacher'} onChange={() => setAccountType('teacher')} />
                        Teacher
                    </label>
                </div>

                <div className='input_field'>
                    <label>First Name:</label>
                    <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>

                <div className='input_field'>
                    <label>Last Name:</label>
                    <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>

                <div className='input_field'>
                    <label>Screen Name:</label>
                    <input type='text' value={screenName} onChange={(e) => setScreenName(e.target.value)} required />
                </div>

                {accountType === 'student' && (
                    <div className='input_field'>
                        <label>Select Teacher:</label>
                        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
                            {teachers.map((t) => (
                                <option key={t._id} value={t._id}>
                                    {`${t.firstName} ${t.lastName}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className='input_field'>
                    <label>Email:</label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className='input_field'>
                    <label>Password:</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type='submit'>Sign Up</button>
            </form>

            {error && (
                <div className='signup_error'>{error}</div>
            )}

            {successMessage && (
                <div className='signup_success'>
                    {successMessage}
                    <div>
                        <Link to="/">Go to Sign In</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignUp;