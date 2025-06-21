import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../UI/Navbar';
import Sidebar from '../UI/Sidebar';
import ProfileUpdate from './ProfileUpdate';
import KYCRegister from './KYCRegister';
import SavedKYCToken from './SavedKYCToken';
import UserData from './UserData';
import UserOrders from './UserOrders';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UserData />;
      case 'profile':
        return <ProfileUpdate />;
      case 'saved-kyc':
        return <SavedKYCToken />;
      case 'orders':
        return <UserOrders />;
      default:
        return <UserData />;
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
          isAdmin={false}
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

export default UserDashboard;