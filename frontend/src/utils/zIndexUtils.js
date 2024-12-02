export const calculateZIndex = (yPosition, id) => {
    const maxZIndex = 1000;
    const maxY = 100;

    // CALCULATE BASE Z-INDEX //
    let zIndex = Math.floor((yPosition / maxY) * maxZIndex);

    // ADD OFFSET BASED ON ID //
    const idOffset = parseInt(id, 36) % maxZIndex;
    zIndex = zIndex * maxZIndex + idOffset;

    return zIndex;
};