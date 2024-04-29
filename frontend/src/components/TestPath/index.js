import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestPath() {
    const [pathCoordinates, setPathCoordinates] = useState([
        { x: 10, y: 10 },
        { x: 20, y: 200 },
        { x: 300, y: 20 },
        ]);
    // DEFINE AN ARRAY OF COORDINATES REPRESENTING POINTS ALONG THE PATH //
    
    // useEffect(() => {
    //     async function fetchPathCoordinates() {
    //         try {
    //             const response = await axios.get('/testPath');
    //             console.log(response)
    //             setPathCoordinates(response.data);
    //         } catch (error) {
    //             console.error('Error fetching path coordinates:', error);
    //         }
    //     }
    //     fetchPathCoordinates();
    // }, []); 
       console.log(pathCoordinates)
    return (
        <div>
            <p>Here is a Path.</p>
            <svg width="100vw" height="100vh">
            <polyline
                points={pathCoordinates.map(coord => `${coord.x},${coord.y}`).join(' ')}
                fill="none"
                stroke="black"
                strokeWidth="2"
            />
            </svg>
        </div>
        
    );
}

export default TestPath;