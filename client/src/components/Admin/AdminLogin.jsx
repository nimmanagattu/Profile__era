import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, ArrowRight, Mail } from 'lucide-react';
import axios from 'axios';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error("VITE_API_URL not defined");

            const response = await axios.post(`${apiUrl}/api/admin/login`, {
                email,
                password
            });

            if (response.data.apiKey) {
                localStorage.setItem('adminKey', response.data.apiKey);
                onLogin(response.data.apiKey);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center px-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-blue-100">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 text-[#1D4ED8]">
                            <Lock size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wider">Admin Portal</h2>
                        <p className="text-gray-500 font-medium">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Key size={18} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1D4ED8] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#1E40AF] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group disabled:opacity-70 uppercase tracking-widest"
                        >
                            {loading ? 'Verifying...' : 'Login to Dashboard'}
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-gray-400 text-sm font-medium">
                    ProfileEra Management System v1.0
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
