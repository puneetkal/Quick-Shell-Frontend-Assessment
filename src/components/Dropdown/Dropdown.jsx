import React, { useContext, useState, useEffect, useRef } from 'react';
import './Dropdown.css';
import Context from '../../context/context';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { grouping, setGrouping, ordering, setOrdering } = useContext(Context);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        <span className="dropdown-icon">☰</span>
        Display
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-section">
            <div className="dropdown-label">Grouping</div>
            <select 
              value={grouping} 
              onChange={(e) => setGrouping(e.target.value)}
              className="dropdown-select"
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          
          <div className="dropdown-section">
            <div className="dropdown-label">Ordering</div>
            <select 
              value={ordering} 
              onChange={(e) => setOrdering(e.target.value)}
              className="dropdown-select"
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown; 