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

// Get random vehicle

// export async function getRandomVehicle() {
//     try {
//         const {data} = await axios.get('http://localhost:8000/vehicles/random');
//         return data;
//     } catch (error) {
//         console.error('Error fetching random vehicle:', error);
//         return { error: 'Failed to fetch random vehicle' };
//     }
// }

export async function getRandomVehicle() {
    try {
        const {data} = await axios.post('http://localhost:8000/vehicles/random');
        return data;
    } catch (error) {
        console.error('Error fetching random vehicle:', error);
        return { error: 'Failed to fetch random vehicle' };
    }
};

export const deleteVehicle = async (vehicleId) => {
    const response = await axios.delete(`http://localhost:8000/vehicles/${vehicleId}`);
    return response.data;
};

// export const deleteVehicle = async (vehicleId) => {
//     const response = await axios.delete(`${BASE_URL}/vehicles/${vehicleId}`);
//     return response.data;
// };