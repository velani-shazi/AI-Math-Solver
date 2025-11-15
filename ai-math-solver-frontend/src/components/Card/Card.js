import React from 'react';
import './Card.css';

function Card({ title, description, animationUrl }) {
  return (
    <div className="card">
      {/* Lottie Animation */}
      <dotlottie-wc
        src={animationUrl}
        style={{ width: '300px', height: '300px' }}
        speed="1"
        autoplay
        loop
      />

      {/* Card Text Content */}
      <h3 className="card-title">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Card;