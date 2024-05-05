import React, { useState } from 'react';
import './MovingSquare.css'; // Import CSS file for styling

function MovingSquare() {
    const [pathCoordinates, setPathCoordinates] = useState([
        { x: 10, y: 10 },
        { x: 20, y: 200 },
        { x: 300, y: 20 },
    ]);

    const moveSquare = (coordinates) => {
        const square = document.querySelector('.square');

        // Move the square to each coordinate in the array sequentially
        coordinates.forEach((coord, index) => {
            const { x, y } = coord;
            setTimeout(() => {
                square.style.transform = `translate(${x}px, ${y}px)`;
            }, index * 1000); // Adjust the delay between movements as needed
        });
    };

    return (
        <div>
            <div className="container">
                <div className="square"></div> {/* Square element */}
            </div>
            <button onClick={() => moveSquare(pathCoordinates)}>Move Square</button> {/* Move square to each coordinate in pathCoordinates */}
        </div>
    );
}

export default MovingSquare;
