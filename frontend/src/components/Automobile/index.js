import React from 'react';
import './automobile.css';
import { calculateZIndex } from '../../utils/zIndexUtils';
import { getBackgroundPosition } from '../../utils/spriteUtils';

const Automobile = ({ vehicle }) => {
    const zIndex = calculateZIndex(vehicle.currentPosition.y, vehicle._id);

    // // IF SHEET INFO IS STORED IN VEHICLE.DISPLAYIMAGE OBJECT: //
    // const spriteInfo = vehicle.displayImage;
    // // OR FALLBACK IF NO MAPPING FOUND //
    // if (!spriteInfo) {
    //     // FALLBACK TO ORIGINAL SINGLE IMAGE //
    //     return (
    //         <img
    //             src={vehicle.image}
    //             alt={vehicle.type}
    //             className='vehicle-image'
    //         />
    //     );
    // }

    // const { sheet, frameIndex } = spriteInfo;
    // const { backgroundPositionX, backgroundPositionY } = getBackgroundPosition(frameIndex);

    const { currentPosition, displayImage } = vehicle;

    const { sheet, frameIndex } = displayImage || {};

    // COMPUTE THE OFFSET WITHIN THE SPRITE SHEET //
    const { backgroundPositionX, backgroundPositionY } = getBackgroundPosition(frameIndex);


    return (
        // <div
        //     className="automobile"
        //     style={{
        //         // position: 'absolute',
        //         left: `${vehicle.currentPosition.x}%`,
        //         top: `${vehicle.currentPosition.y}%`,
        //         // transform: 'translate(-50%, -75%)',
        //         zIndex: zIndex,
        //     }}
        // >
        //     <img
        //         src={vehicle.image}
        //         alt={vehicle.type}
        //         className="vehicle-image"
        //         style={{ transform: 'translate(-50%, -75%)' }}
        //     />
        // </div>

        <div
            className='automobile'
            style={{
                left: `${vehicle.currentPosition.x}%`,
                top: `${vehicle.currentPosition.y}%`,
                zIndex,

                width: '400px',
                height: '400px',
                backgroundImage: `url(${sheet})`,
                backgroundPositionX,
                backgroundPositionY,
                backgroundRepeat: 'no-repeat',
                transform: 'translate(-50%, -75%)', 
            }}
        />
    );
};

export default Automobile;
