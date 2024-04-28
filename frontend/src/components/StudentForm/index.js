import { useState } from "react";
import { createStudent } from "../../utils/api";

const StudentForm = () => {

    const [teacherId, setTeacherId] = useState(localStorage.token)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        teacher: '',
        level: 0,
        user: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createStudent(formData)
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="teacher">Teacher:</label>
                <input
                    type="text"
                    id="teacher"
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="level">Level:</label>
                <input
                    type="number"
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="user">User:</label>
                <input
                    type="text"
                    id="user"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default StudentForm;