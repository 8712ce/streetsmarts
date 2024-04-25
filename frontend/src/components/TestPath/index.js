import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestPath() {
    const [pathCoordinates, setPathCoordinates] = useState([]);

    useEffect(() => {
        async function fetchPathCoordinates() {
            try {
                const response = await axios.get('/testPath');
                setPathCoordinates(response.data);
            } catch (error) {
                console.error('Error fetching path coordinates:', error);
            }
        }
        fetchPathCoordinates();
    }, []);

    return (
        <div>
            <p>Hello World</p>
            <svg width="100vw" height="100vh">
                <polyline
                    points={pathCoordinates.map(coord => `${coord.x}vw,${coord.y}vh`).join(' ')}
                    fill="none"
                    stoke="black"
                />
            </svg>
        </div>
        
    );
}

export default TestPath;