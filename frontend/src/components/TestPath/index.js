import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestPath() {
    const [pathCoordinates, setPathCoordinates] = useState([
        { x: 10, y: 10 },
        { x: 20, y: 15 },
        { x: 30, y: 20 },
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