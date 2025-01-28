export function getBackgroundPosition(frameIndex) {
    const framesPerRow = 4;
    const frameWidth = 400;
    const frameHeight = 400;

    const x = frameIndex % framesPerRow;
    const y = Math.floor(frameIndex / framesPerRow);

    return {
        getBackgroundPositionX: `-${x * frameWidth}px`,
        getBackgroundPositionY: `-${y * frameHeight}px`
    };
}