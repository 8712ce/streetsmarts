import spriteMapping from './spriteMapping';

export function getVehicleSprite(vehicle) {
    const { direction, type, currentIndex, image } = vehicle;
    console.log('getVehicleSprite called with:', {
        direction,
        type,
        currentIndex,
        image
    });

    // GET THE DIRECTION MAPPING //
    const directionMap = spriteMapping[direction];
    if (!directionMap) {
        // IF THERE'S NO MAPPING FOR THE DIRECTION, FALLBACK TO DEFAULT //
        console.warn(`No mapping found for direction: ${direction}`);
        return { frameIndex: 0 };
    }

    // GET THE ARRAY FOR THIS VEHICLE TYPE //
    const vehicleTypeArray = directionMap[type] || directionMap.default;
    if (!vehicleTypeArray) {
        console.warn(`No mapping found for vehicle type: ${type}`);
        return { image, frameIndex: 0 };
    }

    // FIND WHICH ENTRY'S RANGE INCLUDES THE CURRENT INDEX //
    for (const { range, frameIndex } of vehicleTypeArray) {
        if (range.includes(currentIndex)) {
            // RETURN AN OBJECT WIT HBOTH THE SHEET PATH AND WHICH FRAME TO SHOW //
            console.log(`Matched range for ${type}:`, { range, frameIndex });
            return { frameIndex };
        }
    }

    // IF NOTHING MATCHES, FALLBACK //
    console.warn(`No frameIndex found for currentIndex: ${currentIndex} (type: ${type}, direction: ${direction})`);
    return { image, frameIndex: 0 };
}


export function getBackgroundPosition(frameIndex) {
    if (frameIndex === undefined) {
        console.warn("Received undefined frameIndex!");
        return { backgroundPositionX: "0%", backgroundPositionY: "0%", backgroundSize: "400% 400%" };
    }

    const framesPerRow = 4;
    const framesPerColomn = 4;
    // const frameWidth = 400;
    // const frameHeight = 400;
    const frameSizePct = 100 / framesPerRow;

    const x = frameIndex % framesPerRow;
    const y = Math.floor(frameIndex / framesPerColomn);

    // // DYNAMICALLY UPDATE CSS VARIABLE FOR BACKGROUND-SIZE //
    // document.documentElement.style.setProperty('--sprite-size', `${framesPerRow * 100}%`);

    console.log(`FrameIndex: ${frameIndex}, X: ${x}, Y: ${y}`);
    console.log(`backgroundPositionX: ${x * frameSizePct}%`);
    console.log(`backgroundPositionY: ${y * frameSizePct}%`);

    return {
        // backgroundPositionX: `-${x * frameWidth}px`,
        // backgroundPositionY: `-${y * frameHeight}px`,

        backgroundPositionX: `${x * frameSizePct}%`,
        backgroundPositionY: `${y * frameSizePct}%`,
        backgroundSize: `${framesPerRow * 100}% ${framesPerColomn * 100}%`,

        // backgroundPositionX: `-${x * frameSizePct}%`,
        // backgroundPositionY: `-${y * frameSizePct}%`,
        // backgroundSize: `400% 400%`,
    };
}