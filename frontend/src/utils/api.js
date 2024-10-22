import axios from 'axios'

let isFetching = false;

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



export async function getRandomVehicle() {
    if (isFetching) return; // Prevent multiple calls
    isFetching = true;

    try {
        const {data} = await axios.post('http://localhost:8000/vehicles/random');
        return data;
    } catch (error) {
        console.error('Error fetching random vehicle:', error);
        return { error: 'Failed to fetch random vehicle' };
    } finally {
        isFetching = false; // Reset flag
    }
};

export const deleteVehicle = async (vehicleId) => {
    const response = await axios.delete(`http://localhost:8000/vehicles/${vehicleId}`);
    return response.data;
};



// FUNCTION TO CREATE A PEDESTRIAN //
export async function createPedestrian(pedestrianData) {
    try {
        const { data } = await axios.post('http://localhost:8000/pedestrians', pedestrianData);
        return data;
    } catch (error) {
        console.log('Error creating pedestrian:', error);
        throw error;
    }
};



// FUNCTION TO MOVE THE PEDESTRIAN //