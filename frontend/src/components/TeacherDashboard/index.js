import { Link } from 'react-router-dom';

function TeacherDashboard() {
    return (
        <div>
            <h1>Welcome, Teacher!</h1>
            <Link to="/teacher/students">View My Students</Link>
        </div>
    );
}