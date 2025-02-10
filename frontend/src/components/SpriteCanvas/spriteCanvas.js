import React, { useRef, useEffect } from 'react';

const SpriteCanvas = ({ spriteSheetUrl, frameIndex, columns = 4, rows = 4, canvasWidth = 1600, canvasHeight = 1600 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // CREATE AN IMAGE OBJECT FOR THE SPRITE SHEET //
        const spriteImage = new Image();
        spriteImage.src = spriteSheetUrl;

        // WHEN THE IMAGE LOADS, COMPUTE WHICH PART OF THE IMAGE TO DRAW //
        spriteImage.onload = () => {
            
            // CALCULATE THE WIDTH AND HEIGHT OF EACH FRAME //
            const frameWidth = spriteImage.width / columns;
            const frameHeight = spriteImage.height / rows;

            // DETERMINE THE COLUM AND ROW OF THE FRAME //
            const col = frameIndex % columns;
            const row = Math.floor(frameIndex / columns);

            // CALCULATE SOURE COORDINATES ON TEH SPRITE SHEET //
            const sx = col * frameWidth;
            const sy = row * frameHeight;

            // CLEAR THE CANVAS //
            context.clearRect(0, 0, canvas.width, canvas.height);

            // DRAW THE SPECIFIC FRAME FROM THE SPRITE SHEET ONTO THE CANVAS //
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) //
            context,drawImage(
                spriteImage,
                sx,
                sy,
                frameWidth,
                frameHeight,
                0,
                0,
                canvasWidth,
                canvasHeight
            );
        };

        // IF THE SPRITE SHEET URL OR FRAME INDEX CHANGES, THE EFFECT RE-RUNS //
    }, [spriteSheetUrl, frameIndex, columns, rows, canvasWidth, canvasHeight]);



    return (
        // THE CANVAS ELEMENT IS GIVEN AN INTRINSIC RESOLUTION (WIDTH/HEIGHT) AND CAN BE STYLED RESPONSIVELY VIA CSS (HERE, WE USE WIDTH: 100% FOR DEMO) //
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ width: '100%', height: 'auto', display: 'block' }}
        />
    );
};

export default SpriteCanvas;