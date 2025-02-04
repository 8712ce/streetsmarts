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
        return { sheet: image, frameIndex: 0 };
    }

    // GET THE ARRAY FOR THIS VEHICLE TYPE //
    const vehicleTypeArray = directionMap[type] || directionMap.default;
    if (!vehicleTypeArray) {
        return { sheet: image, frameIndex: 0 };
    }

    // FIND WHICH ENTRY'S RANGE INCLUDES THE CURRENT INDEX //
    for (const { range, sheet, frameIndex } of vehicleTypeArray) {
        if (range.includes(currentIndex)) {
            // RETURN AN OBJECT WIT HBOTH THE SHEET PATH AND WHICH FRAME TO SHOW //
            return { sheet, frameIndex };
        }
    }

    // IF NOTHING MATCHES, FALLBACK //
    return { sheet: image, frameIndex: 0 };
}


export function getBackgroundPosition(frameIndex) {
    const framesPerRow = 4;
    // const frameWidth = 400;
    // const frameHeight = 400;
    const frameSizePct = 100 / framesPerRow;

    const x = frameIndex % framesPerRow;
    const y = Math.floor(frameIndex / framesPerRow);

    // // DYNAMICALLY UPDATE CSS VARIABLE FOR BACKGROUND-SIZE //
    // document.documentElement.style.setProperty('--sprite-size', `${framesPerRow * 100}%`);

    return {
        // backgroundPositionX: `-${x * frameWidth}px`,
        // backgroundPositionY: `-${y * frameHeight}px`

        // backgroundPositionX: `-${x * frameWidthPct}%`,
        // backgroundPositionY: `-${y * frameWidthPct}%`,
        // backgroundSize: `${framesPerRow * 100}% ${framesPerRow * 100}%`,

        backgroundPositionX: `-${x * frameSizePct}%`,
        backgroundPositionY: `-${y * frameSizePct}%`,
        backgroundSize: `400% 400%`,
    };
}