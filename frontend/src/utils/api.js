import axios from 'axios'

let isFetching = false;

// USERS

// Sign up Route
export async function signUp(formData) {
    const {data} = await axios.post('http://localhost:8000/users/signup', formData);
    return data;
}

// Login Route
export async function login(formData) {
    
    const { data } = await axios.post('http://localhost:8000/users/login', formData);
    return data;
}

// Create Student
export async function createStudent(formData) {
    // MAKE SURE TO INCLUDE THE AUTHORIZATION HEADER IF NEEDED FOR isAuthenticated //
    // E.G., IF WE STORED THE LOKEN IN LOCALSTORAGE //
    const token = localStorage.getItem('token') || '';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const {data} = await axios.post('http://localhost:8000/students/new', formData, config);
    return data;
}

// CREATE TEACHER //
export async function createTeacher(formData) {
    // MAKE SURE TO INCLUDE THE AUTHORIZATION HEADER IF NEEDED FOR isAuthenticated //
    // E.G., IF WE STORED THE LOKEN IN LOCALSTORAGE //
    const token = localStorage.getItem('token') || '';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.post('http://localhost:8000/teacher/new', formData, config);
    return data;
}



export async function getRandomVehicle(simulationType) {
    if (isFetching) return; // Prevent multiple calls
    isFetching = true;

    try {
        const {data} = await axios.post(`http://localhost:8000/vehicles/random?simulationType=${simulationType}`);
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
export async function movePedestrian(pedestrianId, direction, simulationType) {
    try {
        const { data } = await axios.post(`http://localhost:8000/pedestrians/${pedestrianId}/move`, {
            direction,
            simulationType
        });
        return data;
    } catch (error) {
        console.log(`Error moving pedestrian ${direction}:`, error);
        throw error;
    }
};