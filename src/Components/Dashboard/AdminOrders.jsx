import React, { useEffect, useState } from 'react';
import {
    Clock, CheckCircle, XCircle, RefreshCw,
    Eye, Calendar, CreditCard, Globe, User,
    FileText, Banknote
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/admin`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setError('Failed to fetch admin orders');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };


    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Status updated successfully!');
                fetchOrders(); 
            } else {
                toast.error('Failed to update status.');
            }
        } catch (err) {
            toast.error('An error occurred while updating status.');
            console.error(err);
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'processing':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'completed':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'rejected':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const formatDate = (date) => new Date(date).toLocaleString();

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
                <div className="text-center py-20">
                    <RefreshCw className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                    <p className="text-sky-600 text-lg">Loading all orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
                <div className="text-center py-20">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sky-100">
                        <h1 className="text-3xl font-bold text-sky-900 mb-2">Admin Panel: All Orders</h1>
                        <p className="text-sky-600">Manage and review all customer orders</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sky-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>

                                    <select
                                        className="px-3 py-2 text-sm rounded-lg border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors"
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="rejected">Rejected</option>
                                    </select>



                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                        className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>

                                {/* Order Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
                                    <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-8 h-8" />
                                            <div>
                                                <p className="text-sky-100 text-sm">Sending</p>
                                                <p className="text-xl font-bold">{formatAmount(order.amountToSend)} {order.currencyToSend}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <Banknote className="w-8 h-8" />
                                            <div>
                                                <p className="text-emerald-100 text-sm">Receiving</p>
                                                <p className="text-xl font-bold">{order.currencyToReceive}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <User className="w-8 h-8" />
                                            <div>
                                                <p className="text-purple-100 text-sm">Recipient</p>
                                                <p className="text-lg font-semibold truncate max-w-xs">{order.recipientName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                {selectedOrder === order._id && (
                                    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300 overflow-x-auto">
                                        <div className="bg-sky-50 rounded-xl p-4 space-y-3">
                                            <h4 className="font-semibold text-sky-900 mb-3">Transfer Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div><span className="text-gray-600">Transfer Method:</span> <span className="ml-2 font-medium text-gray-900">{order.transferMethod}</span></div>
                                                <div><span className="text-gray-600">Destination:</span> <span className="ml-2 font-medium text-gray-900">{order.destinationCountry || 'Not specified'}</span></div>
                                                <div><span className="text-gray-600">Recipient Account:</span> <span className="ml-2 font-medium text-gray-900">{order.recipientAccount}</span></div>
                                                <div><span className="text-gray-600">OTP Verified:</span>
                                                    <span className={`ml-2 font-medium ${order.otpVerified ? 'text-green-600' : 'text-red-600'}`}>
                                                        {order.otpVerified ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {(order.purpose || order.notes) && (
                                            <div className="bg-blue-50 rounded-xl p-4">
                                                <h4 className="font-semibold text-blue-900 mb-3">Additional Information</h4>
                                                {order.purpose && <div className="mb-2"><span className="text-gray-600 text-sm">Purpose:</span><p className="text-gray-900 mt-1">{order.purpose}</p></div>}
                                                {order.notes && <div><span className="text-gray-600 text-sm">Notes:</span><p className="text-gray-900 mt-1">{order.notes}</p></div>}
                                            </div>
                                        )}

                                        {order.documentPath && (
                                            <div className="bg-cyan-50 rounded-xl p-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-cyan-600" />
                                                    <span className="font-medium text-cyan-900">Document Attached</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
