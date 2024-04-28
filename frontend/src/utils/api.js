import axios from 'axios'

// USERS

// Sign up Route
export async function signUp(formData) {
    const {data} = await axios.post('http://localhost:8000/users/signup', formData)
    return data
}

// Login Route
export async function login(formData) {
    
    const { data } = await axios.post('http://localhost:8000/users/login', formData)
    return data
}

// Create Student
export async function createStudent(formData) {
    const {data} = await axios.post('http://localhost:8000/students/new', formData)
    return data
}

