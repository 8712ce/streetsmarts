import React from "react";
import { useNavigate } from "react-router-dom";

function DifficultyMenu() {
    const navigate = useNavigate();

    const handleSelectDifficulty = (difficulty) => {
        // 1) PICK A RANDOM SIMULATION TYPE //
        const simulations = ['stopSign', 'trafficSignal'];
        const randomIndex = Math.floor(Math.random() * simulations.length);
        const chosenSimulation = simulations[randomIndex];

        // NAVIGATE TO THE SIMULATION ROUTE, PASSING BOTH `SIMULATION` AND `DIFFICULTY` AS URL PARAMS (OR QUERY PARAMS). //
        navigate(`/simulation?simType=${chosenSimulation}&difficulty=${difficulty}`);
    };

    return (
        <div>
            <h1>Select Your Difficulty Level</h1>

            <button onClick={() => handleSelectDifficulty('beginner')}>Beginner</button>
            <button onClick={() => handleSelectDifficulty('intermediate')}>Intermediate</button>
            <button onClick={() => handleSelectDifficulty('expert')}>Expert</button>

        </div>
    );
}

export default DifficultyMenu;