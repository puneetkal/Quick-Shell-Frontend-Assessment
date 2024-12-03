import React, { useContext, useMemo } from 'react';
import Context from '../../context/context';
import Card from '../Card/Card';
import './Board.css';
import { MdCancel, MdSignalCellularAlt, MdSignalCellularAlt1Bar, MdSignalCellularAlt2Bar } from 'react-icons/md';
import { PiExclamationMarkFill } from 'react-icons/pi';
import { BsThreeDots } from 'react-icons/bs';
import { RiProgress4Line } from 'react-icons/ri';
import { LuCircleDashed } from 'react-icons/lu';
import { FaCheckCircle } from 'react-icons/fa';

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 4: return 'Low';
    case 3: return 'Medium';
    case 2: return 'High';
    case 1: return 'Urgent';
    case 0: return 'No Priority';
    default: return 'Unknown';
  }
};

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

const priorityList = ['0', '4', '3', '2', '1'];

const Board = () => {
  const { data, grouping, ordering } = useContext(Context);

  const groupAndSortData = useMemo(() => {
    if (!data) return {};
    
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    if (!parsedData.tickets) return {};

    const groupedData = {};

    parsedData.tickets.forEach(ticket => {
      let groupKey = '';
      let groupName = '';
      let user = null;

      switch (grouping) {
        case 'status':
          groupKey = ticket.status;
          groupName = ticket.status;
          break;
        case 'user':
          user = parsedData.users.find(u => u.id === ticket.userId);
          groupKey = ticket.userId;
          groupName = user ? user.name : 'Unassigned';
          break;
        case 'priority':
          groupKey = ticket.priority.toString();
          groupName = getPriorityLabel(ticket.priority);
          break;
        default:
          groupKey = 'other';
          groupName = 'Other';
      }

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          name: groupName,
          tickets: [],
          key: groupKey,
          user: user
        };
      }
      groupedData[groupKey].tickets.push(ticket);
    });

    Object.keys(groupedData).forEach(key => {
      groupedData[key].tickets.sort((a, b) => {
        if (ordering === 'priority') {
          return b.priority - a.priority;
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    });

    let sortedGroups = Object.entries(groupedData);

    if (grouping === 'user') {
      sortedGroups.sort(([, a], [, b]) => a.name.localeCompare(b.name));
    } else if (grouping === 'priority') {
      sortedGroups.sort(([keyA], [keyB]) => {
        return priorityList.indexOf(keyA) - priorityList.indexOf(keyB);
      });
    }

    return Object.fromEntries(sortedGroups);
  }, [data, grouping, ordering]);

  const getHeaderIcon = (group) => {
    if (grouping === 'status') {
      return <span className="status-icon">{getStatusIcon(group.name)}</span>;
    } else if (grouping === 'priority') {
      return <span className="priority-icon">{getPriorityIcon(group.key)}</span>;
    } else if (grouping === 'user' && group.user) {
      return (
        <div className="user-avatar-header">
          <img 
            src={`https://ui-avatars.com/api/?name=${group.user.name}&background=random`} 
            alt={group.user.name}
          />
          <span className="status-dot" style={{ 
            backgroundColor: group.user.available ? '#00FF00' : '#999999' 
          }}></span>
        </div>
      );
    }
    return null;
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="board">
      <div className="board-columns">
        {Object.entries(groupAndSortData).map(([key, group]) => (
          <div key={key} className="board-column">
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon">{getHeaderIcon(group)}</span>
                <span>{group.name}</span>
                <span className="ticket-count">{group.tickets.length}</span>
              </div>
              <div className="column-actions">
                <button className="add-button">+</button>
                <button className="more-button">...</button>
              </div>
            </div>
            <div className="column-content">
              {group.tickets.map(ticket => (
                <Card
                  key={ticket.id}
                  id={ticket.id}
                  title={ticket.title}
                  tag={ticket.tag}
                  userId={ticket.userId}
                  status={ticket.status}
                  priority={ticket.priority}
                  grouping={grouping}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
