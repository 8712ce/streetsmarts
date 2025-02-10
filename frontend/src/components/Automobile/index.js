import React from 'react';
import './automobile.css';
import { calculateZIndex } from '../../utils/zIndexUtils';
// import { getBackgroundPosition } from '../../utils/spriteUtils';
import SpriteCanvas from '../SpriteCanvas/spriteCanvas';

const Automobile = ({ vehicle }) => {
    const zIndex = calculateZIndex(vehicle.currentPosition.y, vehicle._id);

    const { currentPosition, displayImage, image } = vehicle;
    // const { frameIndex } = displayImage || {};
    const { frameIndex } = displayImage || { frameIndex: 0 };

    console.log(`Rendering vehicle ${vehicle._id}: frameIndex=${frameIndex}, image=${image}`);

    // // COMPUTE THE OFFSET WITHIN THE SPRITE SHEET //
    // const { backgroundPositionX, backgroundPositionY } = getBackgroundPosition(frameIndex);

    const canvasWidth = 1600;
    const canvasHeight = 1600;


    return (
        // <div
        //     className='automobile'
        //     style={{
        //         left: `${currentPosition.x}%`,
        //         top: `${currentPosition.y}%`,
        //         zIndex,

        //         backgroundImage: `url(${image})`,
        //         backgroundPositionX,
        //         backgroundPositionY,
        //     }}
        // />

        <div
            className='automobile'
            style={{
                left: `${currentPosition.x}%`,
                top: `${currentPosition.y}%`,
                zIndex,
                position: 'absolute',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <SpriteCanvas
                spriteSheetUrl={image}
                frameIndex={frameIndex}
                columns={4}
                rows={4}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
            />
        </div>
    );
};

export default Automobile;
