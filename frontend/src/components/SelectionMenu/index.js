import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import SimulationContainer from './SimulationContainer';

function SelectionMenu() {
    const [difficulty, setDifficulty] = useState('');
    const [simulationType, setSimulationType] = useState('');

    // const navigate = useNavigate();

    const isStartDisabled = !difficulty || !simulationType;

    const handleStart = () => {
        console.log('Starting simulation with:', { difficulty, simulationType });
    };

    return (
        <div className='selection-menu-buttons'>
            <h2>Select Your Difficulty</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        name="difficulty"
                        value="beginner"
                        checked={difficulty === 'beginner'}
                        onChange={() => setDifficulty('beginner')}
                    />
                    Beginner
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="difficulty"
                        value="intermediate"
                        checked={difficulty === 'intermediate'}
                        onChange={() => setDifficulty('intermediate')}
                    />
                    Intermediate
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="difficulty"
                        value="expert"
                        checked={difficulty === 'expert'}
                        onChange={() => setDifficulty('expert')}
                    />
                    Expert
                </label>
            </div>

            <h2>Select Adventure</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        name="adventure"
                        value="stopSign"
                        checked={simulationType === 'stopSign'}
                        onChange={() => setSimulationType('stopSign')}
                    />
                    4-Way Stop Sign
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="adventure"
                        value="trafficSignal"
                        checked={simulationType === 'trafficSignal'}
                        onChange={() => setSimulationType('trafficSignal')}
                    />
                    4-Way Traffic Signal
                </label>
            </div>

            <button onClick={handleStart} disabled={isStartDisabled}>Start</button>

        </div>
    );
}

export default SelectionMenu;