import React, { useState, useEffect } from 'react';
import './MovingSquare.css';

function MovingSquare() {
    
    useEffect(() => {
        const moveSquare = () => {
            const square = document.querySelector('.square');
            const containerWidth = document.querySelector('.container').offsetWidth;
            const squareWidth = square.offsetWidth;
            square.style.left = containerWidth - squareWidth + 'px';
        };

        // Call the moveSquare function after a delay
        const timeout = setTimeout(moveSquare, 1000); // Delay in milliseconds

        // Cleanup function to clear the timeout
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="container">
            <div className="square"></div>
        </div>
    );
}

export default MovingSquare;