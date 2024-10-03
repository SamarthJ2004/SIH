import React from 'react';
import '../styles/FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Real-time Monitoring</h3>
            <p>Track vessel movements and detect anomalies in real-time.</p>
          </div>
          <div className="feature-item">
            <h3>Satellite Integration</h3>
            <p>Analyze satellite data to confirm oil spills and monitor affected areas.</p>
          </div>
          <div className="feature-item">
            <h3>Custom Alerts</h3>
            <p>Set up personalized alerts for critical events and immediate response.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
