import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import SimulationContainer from './SimulationContainer';
import './selectionMenu.css';

function SelectionMenu() {
    const [difficulty, setDifficulty] = useState('');
    const [simulationType, setSimulationType] = useState('');
    const [adventureLabel, setAdventureLabel] = useState('');

    const navigate = useNavigate();

    // const role = localStorage.getItem('role');

    const isStartDisabled = !difficulty || !simulationType;

    const handleStart = () => {
        console.log('Starting with:', { adventureLabel, difficulty });

        if (adventureLabel === 'Bank') {
            navigate('/four_way_stop_signs', {
                state: { difficulty, adventureLabel, simulationType: 'stopSign' },
            });
        }
        else if (adventureLabel === 'School') {
            navigate('/four_way_traffic_signals', {
                state: { difficulty, adventureLabel, simulationType: 'trafficSignal'},
            });
        }
    };

    // const handleLogout = () => {
    //     localStorage.clear();
    //     navigate('/');
    // }

    return (
        <div className='selection-menu-buttons'>
            <h1>Welcome to Street Smarts</h1>
            <p>Start by selecting a difficulty level and the Adventure you would like to embark upon.</p>
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
                        name="adventureLabel"
                        value="Bank"
                        // checked={simulationType === 'stopSign'}
                        checked={adventureLabel === 'Bank'}
                        onChange={() => {
                            setAdventureLabel('Bank');
                            setSimulationType('stopSign')
                        }}
                    />
                    {/* 4-Way Stop Sign */}
                    Bank
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="adventureLabel"
                        value="School"
                        checked={adventureLabel === 'School'}
                        onChange={() => {
                            setAdventureLabel('School');
                            setSimulationType('trafficSignal')
                        }}
                    />
                    {/* 4-Way Traffic Signal */}
                    School
                </label>
            </div>

            <button onClick={handleStart} disabled={isStartDisabled}>Start</button>
        </div>
    );
}

export default SelectionMenu;