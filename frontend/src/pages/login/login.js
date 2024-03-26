import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../utils/api"

export default function Login(props) {
    // const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')

    // update the input value as a user types
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(formData)
        login(formData)
            .then((data) => {
                localStorage.token = data.token;
                props.setIsLoggedIn(true);
                // navigate('/'); // Redirect to home page
            })
            .catch((error) => {
                setError("Incorrect login credentials. Please try again.");
            });
    }

    return(
        <div className="container">
            <h2 className="actionh2">Log In</h2>

            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}
                <div className="form-group">
                    <label htmlFor='email' className="actionlabels">Email</label>
                    <input
                        type='text'
                        name='email'
                        onChange={handleChange}
                        value={formData.email} />
                </div>

                <div className="form-group">
                    <label htmlFor='password' className="actionlabels">Password</label>
                    <input
                        type='password'
                        name='password'
                        onChange={handleChange}
                        value={formData.password} />
                </div>

                <button className="LorS" type="submit">Log In</button>
            </form>
        </div>
    )
}
