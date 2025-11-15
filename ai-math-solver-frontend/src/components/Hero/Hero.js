import React from 'react';
import './Hero.css';
import Calculator from '../Calculator/Calculator';

function Hero() {
  return (
    <div className="hero">
      <h1 className="hero-title">AI Math Solver</h1>
      <div className="calculator-container">
        <Calculator />
      </div>
    </div>
  );
}

export default Hero;