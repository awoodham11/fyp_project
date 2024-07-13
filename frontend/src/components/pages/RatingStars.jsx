import React from 'react';

const RatingStars = ({ rating }) => {
  
  if (rating === undefined || rating === null || rating < 0 || rating > 5) {
    return null; // Return null if rating is invalid
  }

  const filledStars = Math.floor(rating);
  const emptyStars = 5 - filledStars;
  
  const filledStarIcon = <span style={{ color: 'gold' }}>&#9733;</span>;
  const emptyStarIcon = <span style={{ color: 'gray' }}>&#9733;</span>;

  return (
    <div>
      {[...Array(filledStars)].map((_, index) => (
        <span key={index}>{filledStarIcon}</span>
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={index}>{emptyStarIcon}</span>
      ))}
    </div>
  );
};

export default RatingStars;