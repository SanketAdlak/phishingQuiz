import React from 'react';

const ConfidenceSlider = ({ confidence, onConfidenceChange, onInteraction, min = 1, max = 100 }) => {
  return (
    <div className="confidence-slider-container">
      <label htmlFor="confidence-slider">Confidence</label>
      <input
        type="range"
        id="confidence-slider"
        min={min}
        max={max}
        value={confidence}
        onChange={onConfidenceChange}
        onMouseDown={onInteraction}
        onTouchStart={onInteraction}
        className="confidence-slider"
      />
      <span>{confidence}</span>
    </div>
  );
};

export default ConfidenceSlider;
