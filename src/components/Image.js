import React, { useEffect, useState } from 'react';
import apiImage from '../images/api image.jpg';
import mask from '../images/mask.jpg';
import Loading from './Loading.js';
import { useNavigate } from 'react-router-dom';

const Image = () => {
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const showLoadingTimer = setTimeout(() => {
  //     setLoading(true);

  //     const hideLoadingTimer = setTimeout(() => {
  //       setLoading(false);
  //     }, 5000);

  //     return () => clearTimeout(hideLoadingTimer);
  //   }, 5000);

  //   return () => {
  //     clearTimeout(showLoadingTimer);
  //   }
  // }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* {loading && (
        <div className="loading-overlay">
          <Loading stroke="#fff" />
          <p>Fetching satellite images...</p>
        </div>
      )} */}
      <img src={apiImage} alt="a" style={{ marginTop: '250px', width: '50%' }} />
      <img src={mask} alt="visulization" style={{ marginTop: '250px', width: '50%' }} />
    </div>
  );
}

export default Image;