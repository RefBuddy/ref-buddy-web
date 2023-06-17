import React from 'react';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';

const Dashboard: React.FC<any> = () => {
  console.log('Dashboard')
  return (
    <div>
      <Navbar />
      <MyCalendar />
    </div>
  );
}

export default Dashboard;