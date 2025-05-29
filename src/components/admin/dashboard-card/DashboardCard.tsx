import React from 'react';
import './DashboardCard.css';
interface DashboardCardProps {
  count: number; 
  title: string; 
  icon: string;  
}

const DashboardCard: React.FC<DashboardCardProps> = ({ count, title, icon }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <span className="count">{count}</span>
        <img src={icon} alt={title} className="icon" />
      </div>
      <div className="card-footer">
        <span className="title">{title}</span>
      </div>
    </div>
  );
}

export default DashboardCard;
