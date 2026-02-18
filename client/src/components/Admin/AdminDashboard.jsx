import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Download, Trash2, LogOut,
    ExternalLink, Calendar, Phone, Mail,
    RefreshCcw, AlertCircle, CheckCircle
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = ({ adminKey, onLogout }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchLeads = async () => {
        setLoading(true);
        try {
            console.log('Fetching leads from:', `${apiUrl}/api/admin/leads`);
            const response = await axios.get(`${apiUrl}/api/admin/leads`, {
                headers: { 'x-admin-api-key': adminKey }
            });
            console.log('Admin leads refreshed successfully');
            setLeads(response.data);
            setError('');
        } catch (err) {
            console.error('Lead Fetch Error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });

            if (err.response?.status === 401) {
                setError('Unauthorized: Invalid Session. Please login again.');
            } else {
                setError('Failed to load leads. Please check your connection or CORS settings.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/admin/leads/${id}`, {
                headers: { 'x-admin-api-key': adminKey }
            });
            setLeads(leads.filter(lead => lead.id !== id));
            setDeleteId(null);
        } catch (err) {
            alert('Error deleting lead');
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact.includes(searchTerm)
    );

    const stats = [
        { label: 'Total Leads', value: leads.length, icon: <Users size={20} />, color: 'purple' },
        { label: 'New Today', value: leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, icon: <Calendar size={20} />, color: 'blue' }
    ];

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 text-center">{error}</h2>
            <div className="flex gap-4 mt-6">
                <button
                    onClick={fetchLeads}
                    className="bg-[#1D4ED8] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
                <button
                    onClick={onLogout}
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-blue-50 font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-blue-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1D4ED8] rounded-xl flex items-center justify-center text-white font-black text-xl">P</div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">ProfileEra Admin</h1>
                        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-[0.2em] leading-none">Dashboard Control</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors group"
                >
                    <span className="text-sm uppercase tracking-wider">Logout</span>
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] border-2 border-blue-50 shadow-sm flex items-center gap-5"
                        >
                            <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 leading-tight">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Table Section */}
                <div className="bg-white border-2 border-blue-50 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-blue-50 flex flex-col md:flex-row items-center justify-between gap-6">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Submitted Leads</h2>
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or number..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-blue-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <RefreshCcw size={40} className="text-blue-400 animate-spin mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Leads...</p>
                            </div>
                        ) : filteredLeads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <Users size={48} className="text-gray-300 mb-4" />
                                <p className="text-lg font-bold text-gray-400">No leads found</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-blue-50 text-[#1D4ED8] text-[11px] font-black uppercase tracking-[0.15em]">
                                    <tr>
                                        <th className="px-8 py-5">Full Name</th>
                                        <th className="px-8 py-5">Contact Info</th>
                                        <th className="px-8 py-5">Social Profiles</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5 text-right w-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-50">
                                    {filteredLeads.map((lead, i) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-blue-50/30 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#1D4ED8] font-bold text-sm">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{lead.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                        <Phone size={14} className="text-blue-400" />
                                                        {lead.contact}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-3">
                                                    {lead.linkedin !== "Not provided" && (
                                                        <a href={lead.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg group/link transition-colors">
                                                            <ExternalLink size={16} className="group-hover/link:scale-110 transition-transform" />
                                                        </a>
                                                    )}
                                                    {lead.naukri !== "Not provided" && (
                                                        <a href={lead.naukri} target="_blank" rel="noreferrer" className="text-orange-600 hover:text-orange-800 p-2 bg-orange-50 rounded-lg group/link transition-colors">
                                                            <ExternalLink size={16} className="group-hover/link:scale-110 transition-transform" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-bold text-gray-500 whitespace-nowrap">
                                                {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setDeleteId(lead.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de Confirmação de Deleção */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Are you sure?</h3>
                            <p className="text-gray-500 text-center font-medium mb-8">This action cannot be undone. The lead data will be permanently removed.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 py-4 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteId)}
                                    className="flex-1 py-4 font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
