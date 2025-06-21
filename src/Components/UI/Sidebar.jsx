import React, { useState, useEffect } from 'react';
import { FaFirstOrder } from 'react-icons/fa';
import { 
  FiHome, 
  FiUser, 
  FiFilePlus, 
  FiFileText, 
  FiUsers, 
  FiSettings,
  FiChevronRight,
  FiStar,
  FiShield
} from 'react-icons/fi';

const Sidebar = ({ user = { name: 'Zahid Ghotia', role: 'admin' }, activeTab = 'dashboard', setActiveTab = () => {}, isAdmin = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const userLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: <FiHome size={20} />, color: 'from-blue-500 to-purple-600' },
    { id: 'profile', name: 'Update Profile', icon: <FiUser size={20} />, color: 'from-green-500 to-teal-600' },
    { id: 'orders', name: 'Orders', icon: <FaFirstOrder size={20} />, color: 'from-green-500 to-teal-600' },
    { id: 'saved-kyc', name: 'Saved KYC', icon: <FiFileText size={20} />, color: 'from-orange-500 to-red-600' },
  ];

  const adminLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: <FiHome size={20} />, color: 'from-blue-500 to-purple-600' },
    { id: 'users', name: 'User Management', icon: <FiUsers size={20} />, color: 'from-pink-500 to-rose-600' },
    { id: 'orders', name: 'Users Orders', icon: <FaFirstOrder size={20} />, color: 'from-pink-500 to-rose-600' },
    { id: 'profile', name: 'Update Profile', icon: <FiUser size={20} />, color: 'from-green-500 to-teal-600' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative">
      {/* Glowing background effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
          }}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-26' : 'w-72'} relative overflow-hidden`}>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                {isAdmin ? <FiShield className="text-white" size={20} /> : <FiStar className="text-white" size={20} />}
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {isAdmin ? 'Admin Panel' : 'User Panel'}
                </h1>
                <p className="text-xs text-gray-400">Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 cursor-pointer rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
            >
              <FiChevronRight className={`text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-2 relative z-10">
          {links.map((link) => (
            <div
              key={link.id}
              className="relative group"
              onMouseEnter={() => setHoveredItem(link.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => setActiveTab(link.id)}
                className={`w-full cursor-pointer flex items-center px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                  activeTab === link.id
                    ? 'bg-gradient-to-r ' + link.color + ' text-white shadow-2xl transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active indicator */}
                {activeTab === link.id && (
                  <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
                )}
                
                {/* Hover glow effect */}
                {hoveredItem === link.id && activeTab !== link.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-10 rounded-2xl`} />
                )}

                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} relative z-10`}>
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    activeTab === link.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    {link.icon}
                  </div>
                  
                  {!isCollapsed && (
                    <span className="font-medium text-sm tracking-wide transition-all duration-300">
                      {link.name}
                    </span>
                  )}
                </div>

                {/* Slide-in animation for active state */}
                {activeTab === link.id && (
                  <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-ping" />
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-white/10 z-50">
                  {link.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="relative z-10 p-4 border-t border-white/10">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10`}>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user?.firstName + " " + user?.lastName}</p>
                <p className="text-gray-400 text-xs">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="flex justify-center space-x-4 p-4 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`relative p-3 cursor-pointer rounded-xl transition-all duration-300 ${
                activeTab === link.id
                  ? `bg-gradient-to-r ${link.color} text-white shadow-lg transform scale-110`
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.icon}
              
              {/* Active indicator dot */}
              {activeTab === link.id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
              )}
              
              {/* Ripple effect */}
              {activeTab === link.id && (
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-ping" />
              )}
            </button>
          ))}
        </div>
        
        {/* Mobile floating action button for user profile */}
        <div className="absolute -top-16 right-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/20">
            {user?.firstName?.charAt(0).toUpperCase() + user?.lastName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;