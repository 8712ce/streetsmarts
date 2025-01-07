import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
    const navigate = useNavigate();

    // CONSIDER A USER "LOGGED IN" IF LOCAL STORAGE CONTAINS A TOKEN //
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const isLoggedIn = Boolean(token);

    // DECIDE WHICH DASHBOARD TO LINK TO BASED ON THE USER'S ROLE //
    const getDashboardPath = () => {
        if (userRole === 'teacher') {
            return '/teacherDashboard';
        } else if (userRole === 'student') {
            return '/studentDashboard';
        }
        // IF NO ROLE IS FOUND, DISABLE LINK OR DEFAULT TO "/" //
        return '/';
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className='nav_container'>
            <Link to='/menu'>Main Menu</Link>

            {isLoggedIn && (
                <Link to={getDashboardPath()}>Dashboard</Link>
            )}

            {isLoggedIn ? (
                <button onClick={handleLogout}>Log Out</button>
            ) : (
                <Link to='/'>Sign In</Link>
            )}
        </nav>
    );
}

export default Navigation;