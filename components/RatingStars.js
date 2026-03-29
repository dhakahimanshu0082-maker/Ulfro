'use client';

import { useState } from 'react';

export default function RatingStars({ rating = 0, size = 'medium', interactive = false, onChange = null }) {
  const [hovered, setHovered] = useState(0);

  const sizeMap = { small: '1rem', medium: '1.4rem', large: '2rem' };
  const fontSize = sizeMap[size] || sizeMap.medium;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="rating-stars" style={{ fontSize }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`rating-star ${
            star <= (hovered || rating) ? 'rating-star-filled' : 'rating-star-empty'
          } ${interactive ? 'rating-star-interactive' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        >
          {star <= (hovered || rating) ? '★' : '☆'}
        </span>
      ))}
      {!interactive && rating > 0 && (
        <span className="rating-value">{rating}</span>
      )}
    </div>
  );
}
