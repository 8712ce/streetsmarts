export const calculateZIndex = (yPosition, id) => {
    const maxZIndex = 900;
    const maxY = 100;

    // CALCULATE BASE Z-INDEX //
    let zIndex = Math.floor((yPosition / maxY) * maxZIndex);

    // ADD OFFSET BASED ON ID //
    const idOffset = parseInt(id, 36) % 10;
    zIndex = zIndex + idOffset;

    return zIndex;
};