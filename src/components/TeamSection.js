import React from 'react';
import '../styles/TeamSection.css';

import member from '../images/blank_image.jpg';

const TeamSection = () => {
  const teamMembers = [
    { id: 1, name: 'Samarth Jindal', role: 'Web Developer', img: member },
    { id: 2, name: 'Bob Smith', role: 'Lead Developer', img: member },
    { id: 3, name: 'Carol White', role: 'UI/UX Designer', img: member },
    { id: 4, name: 'David Brown', role: 'Backend Developer', img: member },
    { id: 5, name: 'Eva Green', role: 'Data Scientist', img: member },
    { id: 6, name: 'Frank Harris', role: 'DevOps Engineer', img: member },
  ];

  return (
    <div className="team-container" id='team'>
      <h2 className="team-heading">Our Team</h2>
      <div className="team-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="team-member">
            <img src={member.img} alt={member.name} className="member-photo" />
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;