import React from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Board from '../Board/Board';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="controls">
        <Dropdown />
      </div>
      <Board />
    </div>
  );
};

export default Home; 