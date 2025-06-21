import { FiEdit, FiEye, FiMail, FiPhone, FiTrash2 } from "react-icons/fi";

const UserCard = ({ user, getKycConfig, getRoleConfig, setHoveredUser, formatDate, formatLastActive, hoveredUser, handleViewUser, handleEditUser, handleDeleteUser }) => {
    const kycStatus = user.kyc?.status || 'not_started';
    const kycConfig = getKycConfig(kycStatus);
    const roleConfig = getRoleConfig(user.role);

    return (
        <div
            className="group relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden"
            onMouseEnter={() => setHoveredUser(user._id)}
            onMouseLeave={() => setHoveredUser(null)}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white/50 group-hover:ring-blue-200/50 transition-all duration-300">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=6366f1&color=white&size=64`}
                                    alt={user.name || user.email}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                                {user.name || user.email.split('@')[0]}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center space-x-1">
                                <FiMail size={12} />
                                <span>{user.email}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${roleConfig.color} text-white text-xs font-medium flex items-center space-x-1 shadow-lg`}>
                            {roleConfig.icon}
                            <span className="capitalize">{user.role || 'user'}</span>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="space-y-3 mb-6">
                    <div className={`p-3 rounded-2xl ${kycConfig.bgColor} border border-white/50`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${kycConfig.color} flex items-center justify-center text-white shadow-md`}>
                                    {kycConfig.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-600">KYC Status</p>
                                    <p className={`font-semibold ${kycConfig.textColor}`}>{kycConfig.label}</p>
                                </div>
                            </div>
                            {user.kyc?.verifiedAt && (
                                <div className="text-xs text-slate-500">
                                    Verified {formatDate(user.kyc.verifiedAt)}
                                </div>
                            )}
                        </div>
                    </div>

                    {user.phoneNumber && (
                        <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <FiPhone className="text-blue-500" size={16} />
                            <span>{user.phoneNumber}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                        <p>Joined {formatDate(user.createdAt)}</p>
                        <p>Active {formatLastActive(user.lastActiveAt)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 group-hover:scale-110"
                        >
                            <FiEye size={16} />
                        </button>
                        <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200 group-hover:scale-110"
                        >
                            <FiEdit size={16} />
                        </button>
                        <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 group-hover:scale-110"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Overlay */}
            {hoveredUser === user._id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none" />
            )}
        </div>
    );
};

export default UserCard;