import React, { useRef, useEffect, useState } from 'react';
import './OneWayStopSigns.css';

const OneWayStopSigns = () => {
  const squareRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    const square = squareRef.current;
    const divider = dividerRef.current;
  
    let animationRequestId;
    let isPaused = false;
  
    const checkSquarePosition = () => {
      const squareRect = square.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
  
      if (squareRect.left + squareRect.width >= dividerRect.left && !isPaused) {
        square.style.animationPlayState = 'paused';
        isPaused = true;
        setTimeout(() => {
          square.style.animationPlayState = 'running';
          isPaused = false;
        }, 5000); // Pause for 5 seconds
      }
  
      animationRequestId = requestAnimationFrame(checkSquarePosition);
    };
  
    checkSquarePosition();
  
    return () => {
      cancelAnimationFrame(animationRequestId);
    };
  }, []);


  
  return (
    <div className="container">
      <div className="divider" ref={dividerRef}></div>
      <div className="square" ref={squareRef}></div>;
    </div>
  );
};

export default OneWayStopSigns;