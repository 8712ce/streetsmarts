import { useState } from "react"
import { signUp } from "../../utils/api"

export default function SignUp(props) {

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
        signUp(formData)
            .then((data) => {
                localStorage.token = data.token;
                props.setIsLoggedIn(true);
                // navigate('/'); // Redirect to home page
            })
            .catch((error) => {
                setError("Email invalid");
            });
    }

    return( 
        <div className="container">
        <h2 className="actionh2">Sign Up</h2>

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

            <button className="LorS" type="submit">Sign Up</button>
        </form>
    </div>
    )
}