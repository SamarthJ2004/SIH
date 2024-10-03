import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import logo from '../images/logo 1.png';

const Navbar = () => {

  const { ethereum } = window;
  const myWallet = () => {
    async function connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          console.log('Connected', accounts[0]);
        } catch (error) {
          console.error('User denied accound access', error);
          return null;
        }
      }
      else {
        console.log("MetaMask is not installed");
        return null;
      }
    }
    connectWallet();
  }

  const navigate = useNavigate();

  function handleClick() {
    navigate('/login');
  }

  return (
    <header>
      <nav>
        <div className="logo">
          <img src={logo} alt="Spill Atlas Logo" width={50} />
          <h1><Link to="/">Spill Watch</Link></h1>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#team">Team</a></li>
          <button onClick={handleClick} className='cta-btn'>Login</button>
          <button onClick={myWallet} className='cta-btn'>MetaMask</button>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;