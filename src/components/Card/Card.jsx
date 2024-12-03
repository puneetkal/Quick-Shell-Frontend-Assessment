import React, { useContext } from 'react';
import './Card.css';
import Context from '../../context/context';
import { PiExclamationMarkFill } from 'react-icons/pi';
import { MdCancel, MdSignalCellularAlt, MdSignalCellularAlt1Bar, MdSignalCellularAlt2Bar } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { RiProgress4Line } from 'react-icons/ri';
import { LuCircleDashed } from 'react-icons/lu';
import { FaCheckCircle } from 'react-icons/fa';
import { VscCircleLargeFilled } from 'react-icons/vsc';

const Card = ({ id, title, tag, userId, status, priority, grouping }) => {
  const { data } = useContext(Context);
  const user = data.users.find(u => u.id === userId);

  const getPriorityIcon = (priority) => {
    switch (Number(priority)) {
      case 1:
        return <PiExclamationMarkFill color='#FA7B3E' />;
      case 2:
        return <MdSignalCellularAlt />;
      case 3:
        return <MdSignalCellularAlt2Bar />;
      case 4:
        return <MdSignalCellularAlt1Bar />;
      case 0:
        return <BsThreeDots />;
      default:
        return <BsThreeDots />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'todo':
        return '⚪';
      case 'in progress':
        return <RiProgress4Line color='#EEC85F' />;
      case 'backlog':
        return <LuCircleDashed />;
      case 'done':
        return <FaCheckCircle color='#626CDC' />;
      case 'cancelled':
        return <MdCancel />;
      default:
        return '⚪';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="ticket-id">{id}</div>
        {grouping !== 'user' && (
          <div className="user-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
              alt={user?.name} 
            />
            <span className="status-dot" style={{ 
              backgroundColor: user?.available ? '#00FF00' : '#999999' 
            }}></span>
          </div>
        )}
      </div>
      
      <div className="card-title">
        {grouping !== 'status' && (
          <span className="status-icon">{getStatusIcon(status)}</span>
        )}
        <h3>{title}</h3>
      </div>
      
      <div className="card-tags">
        {grouping !== 'priority' && (
          <div className="tag">
            <span className="priority-icon">{getPriorityIcon(priority)}</span>
          </div>
        )}
        {tag && tag.map((t, index) => (
          <div key={index} className="feature-tag">
            <span className='tag-icon'><VscCircleLargeFilled /></span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;