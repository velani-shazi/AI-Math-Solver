import React, { useEffect } from 'react';
import Card from '../Card/Card';
import './CardContents.css';

function CardContents() {
  useEffect(() => {
    // Load Lottie Web Component
    const lottieScript = document.createElement('script');
    lottieScript.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    lottieScript.type = 'module';
    document.head.appendChild(lottieScript);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const cardsData = [
    {
      id: 1,
      title: 'Learn Smarter',
      description: 'Struggling with a problem? Our AI shows you the steps so you actually learn.',
      animationUrl: 'https://lottie.host/d517cf2c-4961-4630-89bc-775edfdf2e38/i9abdShwBL.lottie'
    },
    {
      id: 2,
      title: 'Solve Instantly',
      description: 'Type or build any equation and get instant, accurate solutions with just one click.',
      animationUrl: 'https://lottie.host/75f4c6e6-0214-43a6-9ef0-051c2653697c/5Uxo2tFJaP.lottie'
    },
    {
      id: 3,
      title: 'Built for all levels',
      description: 'From basic algebra to advanced calculus, our tools adapt to your needs.',
      animationUrl: 'https://lottie.host/5de38952-7e95-46b6-b643-d4d9b89f93f2/1fnvZIWr6L.lottie'
    }
  ];

  return (
    <div className="card-contents">
      <h2 className="section-title">Infinity AI, helping you solve math problems</h2>
      <div className="cards">
        <div className="card-list">
          {cardsData.map(card => (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              animationUrl={card.animationUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardContents;