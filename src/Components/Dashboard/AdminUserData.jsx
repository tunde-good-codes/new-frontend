import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiClock, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiActivity,
  FiRefreshCw,
  FiEye,
  FiAlertTriangle,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi';

const AdminUserData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingKYC: 0,
    verifiedKYC: 0,
    rejectedKYC: 0,
    greenVerified: 0,
    newUsersToday: 0,
    growthRate: 0,
    verificationRate: 0,
    greenVerificationRate: 0,
    dailyGrowthRate: 0,
    weeklyGrowthRate: 0,
    monthlyGrowthRate: 0
  });
  const [displayStats, setDisplayStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingKYC: 0,
    verifiedKYC: 0
  });

  // Animated counter effect
  useEffect(() => {
    const animateCounter = (key, target) => {
      if (target > 0) {
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
          setDisplayStats(prev => {
            const current = prev[key];
            if (current < target) {
              return { ...prev, [key]: Math.min(current + increment, target) };
            }
            clearInterval(timer);
            return prev;
          });
        }, 30);
        return timer;
      }
    };

    const timers = [];
    if (!loading) {
      timers.push(animateCounter('totalUsers', stats.totalUsers));
      timers.push(animateCounter('activeUsers', stats.activeUsers));
      timers.push(animateCounter('pendingKYC', stats.pendingKYC));
      timers.push(animateCounter('verifiedKYC', stats.verifiedKYC));
    }

    return () => timers.forEach(timer => timer && clearInterval(timer));
  }, [stats, loading]);

  // Parse backend statistics data
  const parseStatistics = (statistics) => {
    return {
      totalUsers: statistics.totalUsers || 0,
      activeUsers: statistics.activeUsers || 0,
      newUsersToday: statistics.newUsersToday || 0,
      newUsersThisWeek: statistics.newUsersThisWeek || 0,
      newUsersThisMonth: statistics.newUsersThisMonth || 0,
      
      // Map from backend summary
      pendingKYC: statistics.summary?.pendingKYC || 0,
      verifiedKYC: statistics.summary?.verifiedKYC || 0,
      rejectedKYC: statistics.summary?.rejectedKYC || 0,
      greenVerified: statistics.summary?.totalGreenVerified || statistics.greenVerifiedCount || 0,
      
      // Rates and percentages
      verificationRate: statistics.verificationRate || 0,
      greenVerificationRate: statistics.greenVerificationRate || 0,
      dailyGrowthRate: statistics.dailyGrowthRate || 0,
      weeklyGrowthRate: statistics.weeklyGrowthRate || 0,
      monthlyGrowthRate: statistics.monthlyGrowthRate || 0,
      
      // Additional counts
      greenTokenCount: statistics.greenTokenCount || 0,
      expiredTokenCount: statistics.expiredTokenCount || 0,
      
      // Status breakdown
      kycStatusCounts: statistics.kycStatusCounts || {},
      reviewResultCounts: statistics.reviewResultCounts || {},
      
      // Recent activity
      recentActivity: statistics.recentActivity || {}
    };
  };

  // Fetch users data from backend
  const fetchUsersData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success !== false && data.data) {
        // Backend returns users in data and statistics separately
        setUsers(data.data);
        
        if (data.statistics) {
          const parsedStats = parseStatistics(data.statistics);
          setStats(parsedStats);
        }
        
        // Reset display stats for animation
        setDisplayStats({
          totalUsers: 0,
          activeUsers: 0,
          pendingKYC: 0,
          verifiedKYC: 0
        });
      } else {
        throw new Error(data.message || 'Failed to fetch users data');
      }
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users data');
      
      // Fallback to mock data for demo
      const mockStats = {
        totalUsers: 1247,
        activeUsers: 342,
        newUsersToday: 23,
        newUsersThisWeek: 156,
        newUsersThisMonth: 487,
        pendingKYC: 89,
        verifiedKYC: 1045,
        rejectedKYC: 67,
        greenVerified: 892,
        verificationRate: 83.8,
        greenVerificationRate: 71.5,
        dailyGrowthRate: 1.8,
        weeklyGrowthRate: 12.5,
        monthlyGrowthRate: 39.1,
        greenTokenCount: 45,
        expiredTokenCount: 12,
        kycStatusCounts: {
          not_started: 46,
          initiated: 23,
          pending: 45,
          verified: 1045,
          rejected: 67,
          expired: 8,
          on_hold: 7,
          under_review: 6
        },
        reviewResultCounts: {
          GREEN: 892,
          RED: 67,
          YELLOW: 45,
          AMBER: 12,
          PENDING: 51
        },
        recentActivity: {
          verifications: 15,
          tokenGeneration: 8
        }
      };
      
      setStats(mockStats);
      setDisplayStats({
        totalUsers: 0,
        activeUsers: 0,
        pendingKYC: 0,
        verifiedKYC: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsersData();
    setRefreshing(false);
  };

  const dashboardCards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: loading ? '...' : error ? 'Error' : displayStats.totalUsers,
      subValue: stats.newUsersToday > 0 ? `+${stats.newUsersToday} today` : 'No new users today',
      icon: <FiUsers size={24} />,
      gradient: 'from-blue-500 via-purple-500 to-indigo-600',
      glowColor: 'shadow-blue-500/25',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      loading: loading,
      trend: `+${stats.dailyGrowthRate}%`,
      trendIcon: <FiTrendingUp size={14} />,
      progress: 85
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: loading ? '...' : error ? 'Error' : displayStats.activeUsers,
      subValue: 'Last 24 hours',
      icon: <FiActivity size={24} />,
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      glowColor: 'shadow-green-500/25',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50',
      loading: loading,
      trend: stats.totalUsers > 0 ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%` : '0%',
      trendIcon: <FiUserCheck size={14} />,
      progress: stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0
    },
    {
      id: 'pending-kyc',
      title: 'Pending KYC',
      value: loading ? '...' : error ? 'Error' : displayStats.pendingKYC,
      subValue: 'Awaiting review',
      icon: <FiClock size={24} />,
      gradient: 'from-orange-400 via-red-400 to-pink-500',
      glowColor: 'shadow-orange-500/25',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-red-50',
      loading: loading,
      trend: stats.rejectedKYC > 0 ? `${stats.rejectedKYC} rejected` : 'No rejections',
      trendIcon: <FiAlertTriangle size={14} />,
      progress: stats.totalUsers > 0 ? Math.round((stats.pendingKYC / stats.totalUsers) * 100) : 0
    },
    {
      id: 'verified-kyc',
      title: 'Verified KYC',
      value: loading ? '...' : error ? 'Error' : displayStats.verifiedKYC,
      subValue: `${stats.greenVerified} GREEN verified`,
      icon: <FiCheckCircle size={24} />,
      gradient: 'from-emerald-400 via-green-500 to-teal-600',
      glowColor: 'shadow-emerald-500/25',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-green-50',
      loading: loading,
      trend: `${stats.verificationRate}%`,
      trendIcon: <FiTrendingUp size={14} />,
      progress: Math.round(stats.verificationRate)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 mb-20">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2 flex items-center space-x-2">
              <FiActivity className="animate-pulse text-green-500" />
              <span>Real-time KYC analytics and user insights</span>
              {error && (
                <span className="text-red-500 text-sm ml-4">
                  • Using demo data (API error)
                </span>
              )}
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''} text-slate-600`} size={18} />
            <span className="font-medium text-slate-700">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={card.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Container */}
              <div className={`
                relative overflow-hidden rounded-3xl p-6 
                bg-white/70 backdrop-blur-xl border border-white/20
                shadow-xl hover:shadow-2xl ${card.glowColor}
                transform transition-all duration-500 ease-out
                ${hoveredCard === card.id ? 'scale-105 -translate-y-2' : ''}
                ${card.loading ? 'animate-pulse' : ''}
              `}>
                
                {/* Background Pattern */}
                <div className={`absolute inset-0 opacity-5 ${card.bgPattern}`} />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Animated Background Shapes */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700 delay-150" />

                {/* Content */}
                <div className="relative z-10">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {card.icon}
                      </div>
                    </div>
                    
                    {/* Trend Indicator */}
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      card.trend.startsWith('+') || card.trend.endsWith('%')
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {card.trendIcon}
                      <span>{card.trend}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">
                    {card.title}
                  </h3>

                  {/* Main Value */}
                  <div className="mb-4">
                    {card.loading ? (
                      <div className="space-y-2">
                        <div className="h-6 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                      </div>
                    ) : error && card.value === 'Error' ? (
                      <div className="text-red-500 font-medium text-sm">
                        <FiActivity className="inline mr-1" size={14} />
                        Error loading
                      </div>
                    ) : (
                      <>
                        <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                          {card.value}
                        </p>
                        {card.subValue && (
                          <p className="text-xs text-slate-500 mt-1">
                            {card.subValue}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{card.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${card.progress}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                {hoveredCard === card.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl pointer-events-none" />
                )}
              </div>

              {/* Floating Action Button */}
              <div className={`absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-r ${card.gradient} rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-300 ${
                hoveredCard === card.id ? 'scale-110 shadow-2xl' : 'scale-0'
              }`}>
                <FiEye className="text-white" size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* KYC Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KYC Status Distribution */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">KYC Status Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats.kycStatusCounts || {}).map(([status, count]) => (
                <div key={status} className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-sm text-slate-600 capitalize">{status.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Results */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Review Results</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats.reviewResultCounts || {}).map(([result, count]) => {
                const colorMap = {
                  GREEN: 'text-green-600',
                  RED: 'text-red-600',
                  YELLOW: 'text-yellow-600',
                  AMBER: 'text-orange-600',
                  PENDING: 'text-blue-600'
                };
                return (
                  <div key={result} className="text-center">
                    <p className={`text-2xl font-bold ${colorMap[result] || 'text-gray-600'}`}>{count}</p>
                    <p className="text-sm text-slate-600">{result}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Growth Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.dailyGrowthRate}%</p>
              <p className="text-sm text-slate-600">Daily Growth</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.weeklyGrowthRate}%</p>
              <p className="text-sm text-slate-600">Weekly Growth</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.monthlyGrowthRate}%</p>
              <p className="text-sm text-slate-600">Monthly Growth</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.greenVerificationRate}%</p>
              <p className="text-sm text-slate-600">GREEN Rate</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity (24h)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.recentActivity.verifications || 0}</p>
                <p className="text-sm text-slate-600">New Verifications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.recentActivity.tokenGeneration || 0}</p>
                <p className="text-sm text-slate-600">Tokens Generated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.greenTokenCount || 0}</p>
                <p className="text-sm text-slate-600">Active GREEN Tokens</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.expiredTokenCount || 0}</p>
                <p className="text-sm text-slate-600">Expired Tokens</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminUserData;