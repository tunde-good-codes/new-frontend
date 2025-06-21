import React, { useContext, useState } from 'react';
import Navbar from '../UI/Navbar';
import Sidebar from '../UI/Sidebar';
import ProfileUpdate from './ProfileUpdate';
import UserList from './UserList';
import AdminUserData from './AdminUserData';
import { AuthContext } from '../contexts/AuthContext';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminUserData />;
      case 'users':
        return <UserList />;
      case 'orders':
        return <AdminOrders />;
      case 'profile':
        return <ProfileUpdate />;
      default:
        return <AdminUserData />;
    }
  };

  return (
    <div className=" bg-secondary-50">
      <Navbar user={user} logout={logout} />
      <div className="flex">
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={true}
        />
        <main className="flex-1 h-[90vh] overflow-y-scroll p-4 md:p-8 overflow-hidden">
          <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
