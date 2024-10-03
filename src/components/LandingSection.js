import React from 'react';
import '../styles/LandingSection.css'; // Create a CSS file if needed

const LandingSection = () => {
  return (
    <section id="home" className="landing-section">
      <div className="landing-content">
        <h2 className='heading'>Early Detection of Oil Spills and Vessel Distress</h2>
        <p>Integrating AIS and satellite datasets for real-time maritime monitoring.</p>
        <a href="#features" className="cta-btn">Learn More</a>
      </div>
    </section>
  );
};
export default LandingSection;
