import React, { useState, useEffect, useCallback } from 'react';

// NOTE: Update this URL if your Node.js backend is running on a different port or server.
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://ktm-workshop-management-system.onrender.com/api'
    : 'http://localhost:3000/api'; 

// Utility function for API calls
const fetcher = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        let errorMessage = `API call failed: ${response.statusText}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
        } catch (e) {
            // Ignore JSON parse error if response body is empty or not JSON
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

// --- REUSABLE COMPONENTS ---

/**
 * Custom Alert/Toast component (replacing C# MessageBox.Show)
 */
const Alert = ({ message, type, onClose }) => {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl transition-opacity duration-300 z-50`}>
            {message}
            <button className="ml-4 font-bold" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};


/**
 * Reusable Data Table component
 */
const DataTable = ({ data, onRowClick, headerMap = {}, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center bg-gradient-to-br from-ktm-black-light to-ktm-black-medium rounded-2xl border-2 border-dashed border-ktm-orange">
                <div className="text-6xl mb-3">📭</div>
                <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
                <p className="text-gray-300">No data available</p>
            </div>
        );
    }

    const headers = Object.keys(data[0]); 
    const handleClick = onRowClick ? (row) => onRowClick(row) : () => {};
    
    return (
        <div className="overflow-hidden rounded-xl shadow-lg border border-ktm-orange">
            <div className="bg-gradient-to-r from-ktm-orange to-ktm-orange-dark px-6 py-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    📊 {title}
                    <span className="ml-auto bg-ktm-orange/20 px-3 py-1 rounded-full text-sm">{data.length} records</span>
                </h4>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-ktm-black-light">
                    <thead className="bg-ktm-black-medium">
                        <tr>
                            {headers.map(key => (
                                <th 
                                    key={key} 
                                    className="px-6 py-4 border-b-2 border-ktm-orange text-left text-xs font-bold uppercase tracking-wider text-white"
                                >
                                    {headerMap[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-ktm-black-light divide-y divide-ktm-orange/30">
                        {data.map((row, index) => (
                            <tr 
                                key={index} 
                                onClick={() => handleClick(row)}
                                className={`transition-all duration-200 ${onRowClick ? 'cursor-pointer hover:bg-ktm-black-medium hover:shadow-sm' : ''} ${index % 2 === 0 ? 'bg-ktm-black-light' : 'bg-ktm-black-medium'}`}
                            >
                                {headers.map(key => (
                                    <td 
                                        key={key} 
                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white"
                                    >
                                        {row[key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- FOOTER COMPONENT ---

const Footer = () => (
    <footer className="mt-8 bg-ktm-black-light rounded-xl shadow-lg border-2 border-ktm-orange overflow-hidden">
        <div className="p-8">
            {/* Developers Section */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4 text-white">👨‍💻 Developed By</h3>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Developer 1 */}
                    <div className="bg-ktm-black-medium rounded-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-ktm-orange">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-20 h-20 bg-gradient-to-br from-ktm-orange-light to-ktm-orange-dark rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                AR
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Aryan Rajesh Gadam</h4>
                        <p className="text-gray-300 text-sm mb-3">123cs0020@iiitk.ac.in</p>
                        <div className="space-y-2">
                            <a href="tel:+919704563437" className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium">
                                <span className="text-xl">📞</span> +91 9704563437
                            </a>
                        </div>
                    </div>

                    {/* Developer 2 */}
                    <div className="bg-ktm-black-medium rounded-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-ktm-orange">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-20 h-20 bg-gradient-to-br from-ktm-orange-light to-ktm-orange-dark rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                TJ
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Tagore Jagata</h4>
                        <p className="text-gray-300 text-sm mb-3">123cs0042@iiitk.ac.in</p>
                        <div className="space-y-2">
                            <a href="tel:+919154711711" className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium">
                                <span className="text-xl">📞</span> +91 9154711711
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Info */}
            <div className="text-center border-t-2 border-ktm-orange pt-6 mt-6">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏍️</span>
                        <span className="text-white font-medium">KTM Workshop Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🎓</span>
                        <span className="text-white font-medium">IIIT Kurnool Project</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚛️</span>
                        <span className="text-white font-medium">React + PostgreSQL</span>
                    </div>
                </div>
                <p className="text-gray-300 text-sm">
                    © 2025 KTM Workshop Management System. Built with ❤️ for efficient workshop operations.
                </p>
            </div>
        </div>
    </footer>
);

// --- HOME PAGE COMPONENT ---

const HomePage = () => (
    <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-ktm-black-medium border-2 border-ktm-orange rounded-2xl shadow-lg p-10 mb-8">
            <div className="text-center animate-fade-in">
                <span className="text-6xl mb-6 inline-block animate-bounce">🏍️</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-down">
                    KTM Workshop Management System
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto animate-slide-up">
                    Streamline your workshop operations with automated scoring, real-time analytics, and comprehensive revenue tracking
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-ktm-black-light rounded-xl p-6 shadow-md hover:shadow-2xl hover:shadow-ktm-orange/50 hover:scale-110 transition-all duration-500 border-2 border-ktm-orange animate-slide-left-delay-1">
                        <div className="w-14 h-14 bg-ktm-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Real-Time</h3>
                        <p className="text-gray-300 text-sm">Automated scoring and instant calculations</p>
                    </div>
                    <div className="bg-ktm-black-light rounded-xl p-6 shadow-md hover:shadow-2xl hover:shadow-ktm-orange/50 hover:scale-110 transition-all duration-500 border-2 border-ktm-orange animate-fade-in-delay-2">
                        <div className="w-14 h-14 bg-ktm-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📊</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
                        <p className="text-gray-300 text-sm">Comprehensive revenue tracking & reports</p>
                    </div>
                    <div className="bg-ktm-black-light rounded-xl p-6 shadow-md hover:shadow-2xl hover:shadow-ktm-orange/50 hover:scale-110 transition-all duration-500 border-2 border-ktm-orange animate-slide-right-delay-1">
                        <div className="w-14 h-14 bg-ktm-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">👥</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Management</h3>
                        <p className="text-gray-300 text-sm">Complete personnel control system</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-ktm-black-light rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 transition-all duration-300 border-l-4 border-ktm-orange animate-slide-left-delay-1">
                <div className="w-12 h-12 bg-ktm-orange rounded-lg flex items-center justify-center mb-4">
                    <span className="text-3xl">🏢</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Workshop Management</h3>
                <p className="text-gray-300 text-sm">Automated performance scoring based on manpower, visits, and recovery metrics.</p>
            </div>
            <div className="bg-ktm-black-light rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 transition-all duration-300 border-l-4 border-ktm-orange animate-slide-left-delay-2">
                <div className="w-12 h-12 bg-ktm-orange rounded-lg flex items-center justify-center mb-4">
                    <span className="text-3xl">📍</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Area Control</h3>
                <p className="text-gray-300 text-sm">Geographical organization with dedicated in-charges for regional management.</p>
            </div>
            <div className="bg-ktm-black-light rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 transition-all duration-300 border-l-4 border-ktm-orange animate-slide-right-delay-1">
                <div className="w-12 h-12 bg-ktm-orange rounded-lg flex items-center justify-center mb-4">
                    <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Revenue Tracking</h3>
                <p className="text-gray-300 text-sm">Quarterly financial monitoring with automatic profit calculations.</p>
            </div>
            <div className="bg-ktm-black-light rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 transition-all duration-300 border-l-4 border-ktm-orange animate-scale-delay-1">
                <div className="w-12 h-12 bg-ktm-orange rounded-lg flex items-center justify-center mb-4">
                    <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Automated Triggers</h3>
                <p className="text-gray-300 text-sm">Database triggers for real-time score and profit calculations.</p>
            </div>
            <div className="bg-ktm-black-light rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 transition-all duration-300 border-l-4 border-ktm-orange animate-scale-delay-2">
                <div className="w-12 h-12 bg-ktm-orange rounded-lg flex items-center justify-center mb-4">
                    <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Relationship Management</h3>
                <p className="text-gray-300 text-sm">Link workshop in-charges for clear accountability and oversight.</p>
            </div>
            <div className="bg-ktm-black-light rounded-xl shadow-md hover:shadow-xl hover:scale-105 p-6 transition-all duration-300 border-l-4 border-ktm-orange animate-scale-delay-3">
                <div className="w-12 h-12 bg-ktm-orange rounded-lg flex items-center justify-center mb-4">
                    <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Smart Search</h3>
                <p className="text-gray-300 text-sm">Case-insensitive search and filtering for quick data access.</p>
            </div>
        </div>

        {/* Getting Started */}
        <div className="bg-ktm-black-light rounded-xl shadow-lg p-8 border-2 border-ktm-orange animate-fade-in">
            <div className="text-center mb-8">
                <span className="text-4xl mb-3 inline-block animate-bounce">🚀</span>
                <h2 className="text-2xl font-bold text-white">Quick Start Guide</h2>
                <p className="text-gray-300 mt-2">Follow these steps to set up your workshop management system</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="relative bg-ktm-black-medium rounded-xl p-6 border-2 border-ktm-orange animate-slide-in-left hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-4 left-6 bg-ktm-orange text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg animate-pulse">1</div>
                    <h4 className="font-bold text-white mb-2 mt-2">Add Area In-Charges</h4>
                    <p className="text-gray-300 text-sm">Create regional supervisors to oversee geographical areas.</p>
                </div>
                <div className="relative bg-ktm-black-medium rounded-xl p-6 border-2 border-ktm-orange animate-scale-in hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-4 left-6 bg-ktm-orange text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg animate-pulse">2</div>
                    <h4 className="font-bold text-white mb-2 mt-2">Set Up Workshops</h4>
                    <p className="text-gray-300 text-sm">Add workshops with performance metrics and assign managers.</p>
                </div>
                <div className="relative bg-ktm-black-medium rounded-xl p-6 border-2 border-ktm-orange animate-slide-in-right hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-4 left-6 bg-ktm-orange text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg animate-pulse">3</div>
                    <h4 className="font-bold text-white mb-2 mt-2">Track Revenue</h4>
                    <p className="text-gray-300 text-sm">Input quarterly sales data with automatic profit calculations.</p>
                </div>
            </div>
        </div>
    </div>
);

// --- FORMS (Defined outside App for brevity, but logically part of it) ---

const AicForm = ({ formData, setFormData, onSave, onDelete, isEditing }) => (
    <div className="p-6 bg-ktm-black-light rounded-xl shadow-md border border-ktm-orange">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            {isEditing ? '✏️ Update Area IC' : '➕ Add Area IC'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <input 
                type="number" 
                placeholder="ID" 
                value={formData.ID || ''} 
                onChange={(e) => setFormData({ ...formData, ID: parseInt(e.target.value) || '' })}
                className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
            <input 
                type="text" 
                placeholder="First Name" 
                value={formData.FirstName || ''} 
                onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
            <input 
                type="text" 
                placeholder="Middle Name (Optional)" 
                value={formData.MiddleName || ''} 
                onChange={(e) => setFormData({ ...formData, MiddleName: e.target.value })}
                className="col-span-2 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                value={formData.LastName || ''} 
                onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                className="col-span-2 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={onSave} className={`flex-1 px-5 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {isEditing ? '💾 Update' : '✅ Add IC'}
            </button>
            {isEditing && (
                <button onClick={onDelete} className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    🗑️ Delete
                </button>
            )}
            {isEditing && (
                <button onClick={() => setFormData({})} className="flex-1 px-5 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    🔄 Clear
                </button>
            )}
        </div>
    </div>
);

const AreaForm = ({ formData, setFormData, onSave, onDelete }) => {
    // Title case conversion function
    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
    <div className="p-6 bg-ktm-black-light rounded-xl shadow-md border border-ktm-orange">
        <h3 className="text-lg font-bold text-white mb-4">➕ Add New Area</h3>
        <div className="grid grid-cols-2 gap-4">
            <input 
                type="text" 
                placeholder="Area Name (e.g., North Region)" 
                value={formData.Area_Name || ''} 
                onChange={(e) => setFormData({ ...formData, Area_Name: toTitleCase(e.target.value) })}
                className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
            <input 
                type="number" 
                placeholder="Area IC ID (Manager ID)" 
                value={formData.AIC_ID || ''} 
                onChange={(e) => setFormData({ ...formData, AIC_ID: parseInt(e.target.value) || '' })}
                className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
        </div>
        <div className="mt-5 flex gap-2">
            <button onClick={onSave} className="flex-1 px-5 py-3 text-white font-semibold rounded-lg shadow-md bg-green-600 hover:bg-green-700 transition-all">
                ✅ Add Area
            </button>
            {formData.Area_Name && (
                <button onClick={onDelete} className="flex-1 px-5 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">
                    🗑️ Delete Area
                </button>
            )}
        </div>
    </div>
    );
};


const WorkshopForm = ({ formData, setFormData, onSave, onDelete, isEditing }) => {
    // Title case conversion function
    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
    <div className="p-6 bg-ktm-black-light rounded-xl shadow-md border border-ktm-orange">
        <h3 className="text-lg font-bold text-white mb-4">{isEditing ? '✏️ Update Workshop' : '➕ Add Workshop'}</h3>
        <div className="grid grid-cols-3 gap-3">
            <input 
                type="number" 
                placeholder="Code" 
                value={formData.wkCode || ''} 
                onChange={(e) => setFormData({ ...formData, wkCode: parseInt(e.target.value) || '' })}
                className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
            <input 
                type="text" 
                placeholder="Name" 
                value={formData.wkName || ''} 
                onChange={(e) => setFormData({ ...formData, wkName: e.target.value })}
                className="col-span-2 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="text" 
                placeholder="Area (e.g., North)" 
                value={formData.wkArea || ''} 
                onChange={(e) => setFormData({ ...formData, wkArea: toTitleCase(e.target.value) })}
                className="col-span-3 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="number" 
                placeholder="Manpower" 
                value={formData.manpower || ''} 
                onChange={(e) => setFormData({ ...formData, manpower: parseInt(e.target.value) || '' })}
                className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="number" 
                placeholder="Customer Visits" 
                value={formData.customer_visits || ''} 
                onChange={(e) => setFormData({ ...formData, customer_visits: parseInt(e.target.value) || '' })}
                className="col-span-2 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <select
                value={formData.recovery || 'no'}
                onChange={(e) => setFormData({ ...formData, recovery: e.target.value })}
                className="col-span-2 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            >
                <option value="no">Recovery: No</option>
                <option value="yes">Recovery: Yes</option>
            </select>
            <p className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange text-sm font-semibold">Score: {formData.score || 'N/A'}</p>
        </div>
        <div className="mt-5 flex gap-2">
            <button onClick={onSave} className={`flex-1 px-5 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {isEditing ? '💾 Update' : '✅ Add Workshop'}
            </button>
            {isEditing && (
                <button onClick={onDelete} className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    🗑️ Delete
                </button>
            )}
            {isEditing && (
                <button onClick={() => setFormData({})} className="flex-1 px-5 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    🔄 Clear
                </button>
            )}
        </div>
    </div>
    );
};

const WICForm = ({ formData, setFormData, onSave, onDelete, isEditing }) => (
    <div className="p-6 bg-ktm-black-light rounded-xl shadow-md border border-ktm-orange">
        <h3 className="text-lg font-bold text-white mb-4">{isEditing ? '✏️ Update Workshop IC' : '➕ Add Workshop IC'}</h3>
        <div className="grid grid-cols-2 gap-3">
            <input 
                type="number" 
                placeholder="WIC ID" 
                value={formData.WkICID || ''} 
                onChange={(e) => setFormData({ ...formData, WkICID: parseInt(e.target.value) || '' })}
                className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
            />
            <input 
                type="number" 
                placeholder="Area IC ID" 
                value={formData.AreaIC || ''} 
                onChange={(e) => setFormData({ ...formData, AreaIC: parseInt(e.target.value) || '' })}
                className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="text" 
                placeholder="First Name" 
                value={formData.FName || ''} 
                onChange={(e) => setFormData({ ...formData, FName: e.target.value })}
                className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="text" 
                placeholder="Middle Name (Optional)" 
                value={formData.MName || ''} 
                onChange={(e) => setFormData({ ...formData, MName: e.target.value })}
                className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                value={formData.LName || ''} 
                onChange={(e) => setFormData({ ...formData, LName: e.target.value })}
                className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
            <input 
                type="number" 
                placeholder="Rating (1-10)" 
                value={formData.Rating || ''} 
                onChange={(e) => setFormData({ ...formData, Rating: parseInt(e.target.value) || '' })}
                className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
            />
        </div>
        <div className="mt-5 flex gap-2">
            <button onClick={onSave} className={`flex-1 px-5 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {isEditing ? '💾 Update' : '✅ Add WIC'}
            </button>
            {isEditing && (
                <button onClick={onDelete} className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    🗑️ Delete
                </button>
            )}
            {isEditing && (
                <button onClick={() => setFormData({})} className="flex-1 px-5 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                    🔄 Clear
                </button>
            )}
        </div>
    </div>
);

const RevenueForm = ({ formData, setFormData, onSave, onDelete, allRevenueData }) => {
    // Determine if the currently entered PK combination (wkcode, year, quarter) exists in the full data set
    const isEditing = allRevenueData.some(r => 
        r.wkcode === formData.wkcode && 
        r.year === formData.year && 
        r.quarter === formData.quarter
    );

    return (
        <div className="p-6 bg-ktm-black-light rounded-xl shadow-md border border-ktm-orange">
            <h3 className="text-lg font-bold text-white mb-4">{isEditing ? '✏️ Update Revenue' : '➕ Add Revenue'}</h3>
            <div className="grid grid-cols-2 gap-3">
                <input 
                    type="number" 
                    placeholder="Workshop Code" 
                    value={formData.wkcode || ''} 
                    onChange={(e) => setFormData({ ...formData, wkcode: parseInt(e.target.value) || '' })}
                    className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
                />
                <input 
                    type="number" 
                    placeholder="Year" 
                    value={formData.year || ''} 
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || '' })}
                    className="col-span-1 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
                />
                 <input 
                    type="number" 
                    placeholder="Quarter (1-4)" 
                    value={formData.quarter || ''} 
                    onChange={(e) => setFormData({ ...formData, quarter: parseInt(e.target.value) || '' })}
                    className="col-span-2 p-3 border rounded-lg bg-ktm-black-medium text-white border-ktm-orange focus:border-ktm-orange-bright focus:ring-2 focus:ring-ktm-orange/20"
                />
                <input 
                    type="number" 
                    placeholder="Total Sales" 
                    value={formData.total_sales || ''} 
                    onChange={(e) => setFormData({ ...formData, total_sales: parseInt(e.target.value) || '' })}
                    className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                />
                <input 
                    type="number" 
                    placeholder="Service Cost" 
                    value={formData.service_cost || ''} 
                    onChange={(e) => setFormData({ ...formData, service_cost: parseInt(e.target.value) || '' })}
                    className="col-span-1 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                />
                 <p className="col-span-2 p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange text-sm font-semibold">Profit: {(formData.total_sales || 0) - (formData.service_cost || 0)}</p>

            </div>
            <div className="mt-5 flex gap-2">
                <button onClick={onSave} className={`flex-1 px-5 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                    {isEditing ? '💾 Update' : '✅ Add Revenue'}
                </button>
                {isEditing && (
                    <>
                        <button onClick={onDelete} className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                            🗑️ Delete
                        </button>
                        <button onClick={() => setFormData({})} className="flex-1 px-5 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
                            🔄 Clear
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
// --- MAIN APP COMPONENT ---

const App = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('home');
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    // Data State
    const [aicData, setAicData] = useState([]);
    const [areaData, setAreaData] = useState([]);
    const [workshopData, setWorkshopData] = useState([]);
    const [wicData, setWicData] = useState([]);
    const [managesData, setManagesData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    
    // Form/Editing State
    const [aicForm, setAicForm] = useState({});
    const [areaForm, setAreaForm] = useState({}); // Area Form State
    const [workshopForm, setWorkshopForm] = useState({});
    const [wicForm, setWicForm] = useState({});
    const [revenueForm, setRevenueForm] = useState({});
    const [managesForm, setManagesForm] = useState({}); // For adding new manages entry

    // Filter/Search State
    const [aicSearchTerm, setAicSearchTerm] = useState('');
    const [workshopSearchTerm, setWorkshopSearchTerm] = useState('');
    const [wicSearchTerm, setWicSearchTerm] = useState('');


    // Secondary Grid State (for filtering related data)
    const [areasByAic, setAreasByAic] = useState([]); // Linked to AIC click
    const [wicsByAic, setWicsByAic] = useState([]);   // Linked to AIC click

    const [workshopsByArea, setWorkshopsByArea] = useState([]); // Linked to Area click

    const [managesByWic, setManagesByWic] = useState([]);           // Linked to WIC click (Workshops managed by WIC)
    const [managesByWorkshop, setManagesByWorkshop] = useState([]); // Linked to Workshop click (WICs managing the Workshop)
    
    const [revenuesByWorkshop, setRevenuesByWorkshop] = useState([]); // Linked to Workshop click


    // --- UTILITIES & EFFECTS ---

    const clearAlert = useCallback(() => setAlert(null), []);

    const showAlert = useCallback((message, type) => {
        setAlert({ message, type });
        setTimeout(clearAlert, 4000);
    }, [clearAlert]);

    const fetchData = useCallback(async (entity, setter, endpoint) => {
        setLoading(true);
        try {
            const data = await fetcher(endpoint);
            setter(data);
        } catch (error) {
            showAlert(`Error fetching ${entity}: ${error.message}`, 'error');
            setter([]);
        } finally {
            setLoading(false);
        }
    }, [showAlert]);
    
    const refreshAllPrimaryData = useCallback(async () => {
        await fetchData('Area In-Charges', setAicData, '/aics');
        await fetchData('Areas', setAreaData, '/aics/areas');
        await fetchData('Workshops', setWorkshopData, '/workshops');
        await fetchData('Workshop ICs', setWicData, '/wics');
        await fetchData('Manages', setManagesData, '/wics/manages');
        await fetchData('Revenue', setRevenueData, '/workshops/revenue');
    }, [fetchData]);

    // Primary Data Fetch Effect
    useEffect(() => {
        refreshAllPrimaryData();
    }, [refreshAllPrimaryData]);

    // Generic function to handle API calls (Add/Update/Delete)
    const handleAction = async (method, endpoint, body, successMessage, refresh) => {
        setLoading(true);
        try {
            await fetcher(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null,
            });
            showAlert(successMessage, 'success');
            await refresh(); 
        } catch (error) {
            showAlert(`Operation failed: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };


    // --- ROW CLICK HANDLERS (Filtering Secondary Grids) ---

    // Handler for AIC Row Click (Form1.cs: dataGridView1_CellClick)
    const handleAicRowClick = async (aic) => {
        setAicForm(aic); // Load data for editing
        
        // Load Areas by this AIC (dataGridView2)
        await fetchData(`Areas for AIC ${aic.ID}`, setAreasByAic, `/aics/${aic.ID}/areas`);
        
        // Load WICs supervised by this AIC (dataGridView4)
        await fetchData(`WICs for AIC ${aic.ID}`, setWicsByAic, `/wics/area/${aic.ID}`);
    };

    // Handler for Area Row Click (Form1.cs: dataGridView2_CellClick)
    const handleAreaRowClick = async (area) => {
        await fetchData(`Workshops in Area ${area.Area_Name}`, setWorkshopsByArea, `/workshops/area/${area.Area_Name}`);
    };

    // Handler for Workshop Row Click (Form1.cs: dataGridView3_CellClick)
    const handleWorkshopRowClick = async (workshop) => {
        setWorkshopForm(workshop); // Load data for editing/deletion

        // Load Manages (WICs managing this workshop) (dataGridView5)
        await fetchData(`WICs for Workshop ${workshop.wkCode}`, setManagesByWorkshop, `/wics/manages/workshop/${workshop.wkCode}`);

        // Load Revenue for this workshop (dataGridView6)
        await fetchData(`Revenues for Workshop ${workshop.wkCode}`, setRevenuesByWorkshop, `/workshops/${workshop.wkCode}/revenue`);
        setRevenueForm({}); // Clear revenue form context
    };

    // Handler for WIC Row Click (Form1.cs: dataGridView4_CellClick)
    const handleWicRowClick = async (wic) => {
        setWicForm(wic); // Load data for editing/deletion

        // Load Manages (Workshops managed by this WIC) (dataGridView5)
        await fetchData(`Workshops managed by WIC ${wic.WkICID}`, setManagesByWic, `/wics/manages/ic/${wic.WkICID}`);
        setManagesForm({ ICID: wic.WkICID }); // Pre-fill form for relationship creation
    };
    
    // Handler for Revenue Row Click (Form1.cs: dataGridView6_CellClick)
    const handleRevenueRowClick = (revenue) => {
        // Load data for editing/deletion
        setRevenueForm(revenue); 
    };


    // --- CRUD HANDLERS (AICs, Workshops, WICs, Revenue, Manages) ---

    // AIC Handlers
    const handleAicSave = async () => {
        const isEditing = aicForm.ID && aicData.some(a => a.ID === aicForm.ID);
        const endpoint = isEditing ? `/aics/${aicForm.ID}` : '/aics';
        const method = isEditing ? 'PUT' : 'POST';
        const message = isEditing ? 'AIC updated successfully.' : 'AIC added successfully.';
        
        await handleAction(method, endpoint, aicForm, message, refreshAllPrimaryData);
        setAicForm({});
    };

    const handleAicDelete = async () => {
        if (!aicForm.ID || !window.confirm(`Are you sure you want to delete Area IC ID ${aicForm.ID}?`)) return;
        await handleAction('DELETE', `/aics/${aicForm.ID}`, null, 'AIC deleted successfully.', refreshAllPrimaryData);
        setAicForm({});
        setAreasByAic([]);
        setWicsByAic([]);
    };
    
    // Area Handlers
    const handleAddArea = async () => {
        // --- FIX: Ensure the keys sent match the keys validated in the Node.js route ---
        if (!areaForm.Area_Name || !areaForm.AIC_ID) {
            return showAlert("Area Name and Area IC ID are required.", 'error');
        }

        const areaToSave = {
            Area_Name: areaForm.Area_Name, // Used for Node validation
            AIC_ID: areaForm.AIC_ID        // Used for Node validation
        };
        // ----------------------------------------------------------------------------------

        // POST route to the API endpoint we created
        await handleAction('POST', '/aics/areas', areaToSave, 'Area added successfully.', refreshAllPrimaryData);
        setAreaForm({});
    };

    const handleAreaDelete = async () => {
        if (!areaForm.Area_Name) {
            return showAlert('Please enter/select an Area Name to delete.', 'error');
        }
        if (!window.confirm(`Are you sure you want to delete Area '${areaForm.Area_Name}'?`)) return;
        await handleAction('DELETE', `/aics/areas/${encodeURIComponent(areaForm.Area_Name)}`, null, `Area '${areaForm.Area_Name}' deleted successfully.`, refreshAllPrimaryData);
        setAreaForm({});
        setWorkshopsByArea([]);
    };

    // Workshop Handlers
    const handleWorkshopSave = async () => {
        const isEditing = workshopForm.wkCode && workshopData.some(w => w.wkCode === workshopForm.wkCode);
        const endpoint = isEditing ? `/workshops/${workshopForm.wkCode}` : '/workshops';
        const method = isEditing ? 'PUT' : 'POST';
        const message = isEditing ? 'Workshop updated successfully.' : 'Workshop added successfully.';
        
        await handleAction(method, endpoint, workshopForm, message, refreshAllPrimaryData);
        setWorkshopForm({});
    };

    const handleWorkshopDelete = async () => {
        if (!workshopForm.wkCode || !window.confirm(`Are you sure you want to delete Workshop Code ${workshopForm.wkCode}? This will also delete related Revenue and Manages entries.`)) return;
        await handleAction('DELETE', `/workshops/${workshopForm.wkCode}`, null, 'Workshop deleted successfully.', refreshAllPrimaryData);
        setWorkshopForm({});
        setManagesByWorkshop([]);
        setRevenuesByWorkshop([]);
    };

    // WIC Handlers
    const handleWicSave = async () => {
        const isEditing = wicForm.WkICID && wicData.some(w => w.WkICID === wicForm.WkICID);
        const endpoint = isEditing ? `/wics/${wicForm.WkICID}` : '/wics';
        const method = isEditing ? 'PUT' : 'POST';
        const message = isEditing ? 'WIC updated successfully.' : 'WIC added successfully.';
        
        await handleAction(method, endpoint, wicForm, message, refreshAllPrimaryData);
        setWicForm({}); 
    };

    const handleWicDelete = async () => {
        if (!wicForm.WkICID || !window.confirm(`Are you sure you want to delete WIC ID ${wicForm.WkICID}?`)) return;
        await handleAction('DELETE', `/wics/${wicForm.WkICID}`, null, 'WIC deleted successfully.', refreshAllPrimaryData);
        setWicForm({});
        setManagesByWic([]);
    };

    // Revenue Handlers
    const handleRevenueSave = async () => {
        // Check if the entry already exists in the local data state
        const isEditing = revenueData.some(r => 
            r.wkcode === revenueForm.wkcode && 
            r.year === revenueForm.year && 
            r.quarter === revenueForm.quarter
        );

        // Use POST to '/workshops/revenue' for adds, and PUT with PKs in path for updates
        const endpoint = isEditing 
            ? `/workshops/revenue/${revenueForm.wkcode}/${revenueForm.year}/${revenueForm.quarter}`
            : '/workshops/revenue';
        const method = isEditing ? 'PUT' : 'POST';
        const message = isEditing ? 'Revenue entry updated successfully.' : 'Revenue entry added successfully.';
        
        await handleAction(method, endpoint, revenueForm, message, refreshAllPrimaryData);
        
        // Only clear form if NOT editing (i.e., it was a successful add)
        if (!isEditing) {
            setRevenueForm({}); 
        }
        
        // Refresh filtered revenue data specific to the current workshop context
        if (workshopForm.wkCode) {
              await fetchData(`Revenues for Workshop ${workshopForm.wkCode}`, setRevenuesByWorkshop, `/workshops/${workshopForm.wkCode}/revenue`);
        }
    };

    const handleRevenueDelete = async () => {
        if (!revenueForm.wkcode || !window.confirm(`Delete Revenue entry for Workshop ${revenueForm.wkcode}, Year ${revenueForm.year}, Quarter ${revenueForm.quarter}?`)) return;
        const endpoint = `/workshops/revenue/${revenueForm.wkcode}/${revenueForm.year}/${revenueForm.quarter}`;
        await handleAction('DELETE', endpoint, null, 'Revenue entry deleted successfully.', refreshAllPrimaryData);
        
        if (workshopForm.wkCode) {
              await fetchData(`Revenues for Workshop ${workshopForm.wkCode}`, setRevenuesByWorkshop, `/workshops/${workshopForm.wkCode}/revenue`);
        }
        setRevenueForm({});
    };
    
    // Manages Handlers
    const handleManagesEntryAdd = async () => {
        if (!managesForm.WkshpID || !managesForm.ICID) {
            return showAlert("Both Workshop ID and IC ID must be provided.", 'error');
        }
        
        await handleAction('POST', '/wics/manages', managesForm, 'Relationship established successfully.', refreshAllPrimaryData);
        setManagesForm({}); // Clear form

        // If currently viewing related WICs/Workshops, refresh the context
        if (workshopForm.wkCode) {
              await fetchData(`WICs for Workshop ${workshopForm.wkCode}`, setManagesByWorkshop, `/wics/manages/workshop/${workshopForm.wkCode}`);
        }
        if (wicForm.WkICID) {
              await fetchData(`Workshops managed by WIC ${wicForm.WkICID}`, setManagesByWic, `/wics/manages/ic/${wicForm.WkICID}`);
        }
    };

    const handleManagesEntryDelete = async (entry) => {
        if (!window.confirm(`Delete relationship: Workshop ${entry.WkshpID} managed by IC ${entry.ICID}?`)) return;
        const endpoint = `/wics/manages/${entry.WkshpID}/${entry.ICID}`;
        await handleAction('DELETE', endpoint, null, 'Relationship deleted successfully.', refreshAllPrimaryData);

        // Refresh filtered data
        if (workshopForm.wkCode) {
              await fetchData(`WICs for Workshop ${workshopForm.wkCode}`, setManagesByWorkshop, `/wics/manages/workshop/${workshopForm.wkCode}`);
        }
        if (wicForm.WkICID) {
              await fetchData(`Workshops managed by WIC ${wicForm.WkICID}`, setManagesByWic, `/wics/manages/ic/${wicForm.WkICID}`);
        }
    };

    // --- SEARCH HANDLERS ---
    const handleAicSearch = async (e) => {
        e.preventDefault();
        const endpoint = aicSearchTerm ? `/aics/search?term=${aicSearchTerm}` : '/aics';
        await fetchData('Area In-Charges', setAicData, endpoint);
    };

    const handleWorkshopSearch = async (e) => {
        e.preventDefault();
        const endpoint = workshopSearchTerm ? `/workshops/search?term=${workshopSearchTerm}` : '/workshops';
        await fetchData('Workshops', setWorkshopData, endpoint);
    };
    
    const handleWicSearch = async (e) => {
        e.preventDefault();
        const endpoint = wicSearchTerm ? `/wics/search?term=${wicSearchTerm}` : '/wics';
        await fetchData('Workshop ICs', setWicData, endpoint);
    };

    const tabClasses = (tab) => 
        `px-6 py-3 font-semibold transition-all duration-300 border-b-4 ${
            activeTab === tab 
            ? 'bg-gradient-to-t from-ktm-orange to-ktm-orange-dark text-white border-ktm-orange-dark shadow-lg transform scale-105' 
            : 'bg-ktm-black-light text-white border-transparent hover:bg-ktm-black-medium hover:border-ktm-orange hover:text-ktm-orange'
        } rounded-t-lg`;

    return (
        <div className="min-h-screen bg-ktm-black p-4 font-sans">
            {alert && <Alert message={alert.message} type={alert.type} onClose={clearAlert} />}

            <header className="bg-gradient-to-r from-ktm-orange to-ktm-orange-dark text-white p-5 rounded-xl shadow-lg mb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🏍️</span>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                KTM Workshop Management
                            </h1>
                            <p className="text-white/80 text-sm mt-1">
                                Professional Workshop Operations & Revenue Tracking
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="flex justify-start border-b-2 border-ktm-orange overflow-x-auto flex-wrap bg-ktm-black-light rounded-t-xl shadow-md p-2 gap-2">
                <button className={tabClasses('home')} onClick={() => setActiveTab('home')}>🏠 Home</button>
                <button className={tabClasses('aics')} onClick={() => setActiveTab('aics')}>👔 Area ICs</button>
                <button className={tabClasses('areas')} onClick={() => setActiveTab('areas')}>📍 Areas</button>
                <button className={tabClasses('wics')} onClick={() => setActiveTab('wics')}>👨‍💼 Workshop ICs</button>
                <button className={tabClasses('workshops')} onClick={() => setActiveTab('workshops')}>🏭 Workshops</button>
                <button className={tabClasses('manages')} onClick={() => setActiveTab('manages')}>🔗 Manages</button>
                <button className={tabClasses('revenue')} onClick={() => setActiveTab('revenue')}>💰 Revenue</button>
            </div>

            {loading && (
                <div className="text-center p-6 bg-orange-50 rounded-lg my-4 border-2 border-ktm-orange">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-ktm-orange border-t-transparent rounded-full mr-3"></div>
                    <span className="text-ktm-orange-dark font-bold text-lg">Loading data...</span>
                </div>
            )}

            <main className="bg-ktm-black-light p-8 rounded-b-2xl shadow-lg border-t-2 border-ktm-orange">
                {/* --- TAB: HOME --- */}
                {activeTab === 'home' && <HomePage />}

                {/* --- TAB: AREA ICs --- */}
                {activeTab === 'aics' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <AicForm 
                                formData={aicForm} 
                                setFormData={setAicForm} 
                                onSave={handleAicSave} 
                                onDelete={handleAicDelete} 
                                isEditing={aicForm.ID && aicData.some(a => a.ID === aicForm.ID)}
                            />
                        </div>
                        <div className="col-span-2 space-y-4">
                            <form onSubmit={handleAicSearch} className="flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Search Area IC by Name..."
                                    value={aicSearchTerm}
                                    onChange={(e) => setAicSearchTerm(e.target.value)}
                                    className="flex-grow p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                                />
                                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Search</button>
                                <button type="button" onClick={() => fetchData('Area In-Charges', setAicData, '/aics')} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Load All</button>
                            </form>
                            <DataTable 
                                data={aicData} 
                                onRowClick={handleAicRowClick} 
                                title="Area In-Charges (Click to see related Areas/WICs)" 
                                headerMap={{ ID: 'ID', FirstName: 'First Name', MiddleName: 'Middle Name', LastName: 'Last Name' }}
                            />
                            
                            {/* Secondary grids based on selected AIC */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DataTable data={areasByAic} title={`Areas Controlled by IC ${aicForm.ID || '...'}`} headerMap={{ Area_Name: 'Area Name', AIC_ID: 'Area IC ID' }}/>
                                <DataTable data={wicsByAic} title={`WICs Supervised by IC ${aicForm.ID || '...'}`} headerMap={{ WkICID: 'WIC ID', FName: 'First Name', Rating: 'Rating' }}/>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: AREAS --- */}
                {activeTab === 'areas' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <AreaForm formData={areaForm} setFormData={setAreaForm} onSave={handleAddArea} onDelete={handleAreaDelete} />
                            <p className="text-sm text-gray-600 mt-4">
                                Note: Area names like North, South, East, West are typical.
                            </p>
                        </div>
                        <div className="col-span-2">
                            <div className="mb-6">
                                <DataTable 
                                    data={areaData} 
                                    onRowClick={(row) => { setAreaForm(row); handleAreaRowClick(row); }} 
                                    title="All Registered Areas (Click row to filter Workshops)" 
                                    headerMap={{ Area_Name: 'Area Name', AIC_ID: 'Area IC ID' }}
                                />
                            </div>
                            <DataTable 
                                data={workshopsByArea} 
                                title={`Workshops in Selected Area (${workshopsByArea.length})`}
                                headerMap={{ wkCode: 'Code', wkName: 'Name', manpower: 'Manpower', score: 'Score' }}
                            />
                        </div>
                    </div>
                )}

                {/* --- TAB: WORKSHOPS --- */}
                {activeTab === 'workshops' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <WorkshopForm 
                                formData={workshopForm} 
                                setFormData={setWorkshopForm} 
                                onSave={handleWorkshopSave}
                                onDelete={handleWorkshopDelete}
                                isEditing={workshopForm.wkCode && workshopData.some(w => w.wkCode === workshopForm.wkCode)}
                            />
                        </div>
                        <div className="col-span-2 space-y-4">
                             <form onSubmit={handleWorkshopSearch} className="flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Search Workshop by Name..."
                                    value={workshopSearchTerm}
                                    onChange={(e) => setWorkshopSearchTerm(e.target.value)}
                                    className="flex-grow p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                                />
                                <button type="submit" className="bg-ktm-orange text-white px-4 py-2 rounded-lg hover:bg-ktm-orange-dark">Search</button>
                                <button type="button" onClick={() => fetchData('Workshops', setWorkshopData, '/workshops')} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Load All</button>
                            </form>
                            <DataTable 
                                data={workshopData} 
                                onRowClick={handleWorkshopRowClick} 
                                title="All Workshops (Click to see Revenue/Manages)" 
                                headerMap={{ wkCode: 'Code', wkName: 'Name', wkArea: 'Area', customer_visits: 'Cust Visits', recovery: 'Recovery', score: 'Score' }}
                            />

                            {/* Secondary grids based on selected Workshop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DataTable data={managesByWorkshop} title={`WICs Managing Workshop ${workshopForm.wkCode || '...'}`} headerMap={{ WkshpID: 'Wk Code', ICID: 'WIC ID' }}/>
                                <DataTable data={revenuesByWorkshop} onRowClick={handleRevenueRowClick} title={`Revenue for Workshop ${workshopForm.wkCode || '...'}`} />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* --- TAB: REVENUE --- */}
                {activeTab === 'revenue' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <RevenueForm 
                                formData={revenueForm} 
                                setFormData={setRevenueForm} 
                                onSave={handleRevenueSave}
                                onDelete={handleRevenueDelete}
                                // Pass revenueData to the form for the isEditing check
                                allRevenueData={revenueData} 
                            />
                            <button type="button" onClick={() => fetchData('Revenue', setRevenueData, '/workshops/revenue')} className="mt-6 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600">Load All Revenues</button>
                        </div>
                        <div className="col-span-2">
                            <DataTable 
                                data={revenueData} 
                                onRowClick={handleRevenueRowClick} 
                                title="All Revenue Records (Click row to edit/delete)" 
                                headerMap={{ wkcode: 'WK Code', year: 'Year', quarter: 'Qtr', total_sales: 'Sales', service_cost: 'Cost', profit: 'Profit' }}
                            />
                        </div>
                    </div>
                )}
                
                {/* --- TAB: WORKSHOP ICs (WIC) --- */}
                {activeTab === 'wics' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <WICForm 
                                formData={wicForm} 
                                setFormData={setWicForm} 
                                onSave={handleWicSave}
                                onDelete={handleWicDelete}
                                isEditing={wicForm.WkICID && wicData.some(w => w.WkICID === wicForm.WkICID)}
                            />
                        </div>
                        <div className="col-span-2 space-y-4">
                             <form onSubmit={handleWicSearch} className="flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Search WIC by First Name..."
                                    value={wicSearchTerm}
                                    onChange={(e) => setWicSearchTerm(e.target.value)}
                                    className="flex-grow p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                                />
                                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Search</button>
                                <button type="button" onClick={() => fetchData('Workshop ICs', setWicData, '/wics')} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Load All</button>
                            </form>
                            <DataTable 
                                data={wicData} 
                                onRowClick={handleWicRowClick} 
                                title="All Workshop In-Charges (Click to see managed Workshops)" 
                                headerMap={{ WkICID: 'ID', FName: 'First Name', Rating: 'Rating', AreaIC: 'Area IC ID' }}
                            />

                            {/* Secondary grid based on selected WIC */}
                            <DataTable data={managesByWic} title={`Workshops Managed by WIC ${wicForm.WkICID || '...'}`} headerMap={{ WkshpID: 'Wk Code', ICID: 'WIC ID' }}/>
                        </div>
                    </div>
                )}
                
                {/* --- TAB: MANAGES RELATIONS --- */}
                {activeTab === 'manages' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 p-4 bg-ktm-black-light rounded-lg shadow-inner border border-ktm-orange">
                            <h3 className="text-lg font-bold text-white mb-3">Add Relationship</h3>
                            <div className="space-y-3">
                                <input 
                                    type="number" 
                                    placeholder="Workshop Code (WkshpID)" 
                                    value={managesForm.WkshpID || ''} 
                                    onChange={(e) => setManagesForm({ ...managesForm, WkshpID: parseInt(e.target.value) || '' })}
                                    className="w-full p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                                />
                                <input 
                                    type="number" 
                                    placeholder="WIC ID (ICID)" 
                                    value={managesForm.ICID || ''} 
                                    onChange={(e) => setManagesForm({ ...managesForm, ICID: parseInt(e.target.value) || '' })}
                                    className="w-full p-2 border rounded-md bg-ktm-black-medium text-white border-ktm-orange"
                                />
                                <button onClick={handleManagesEntryAdd} className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                                    Establish Link
                                </button>
                                {managesForm.WkshpID && managesForm.ICID && (
                                    <button onClick={() => handleManagesEntryDelete(managesForm)} className="w-full mt-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">
                                        Delete Link
                                    </button>
                                )}
                            </div>
                            <button type="button" onClick={() => fetchData('Manages', setManagesData, '/wics/manages')} className="mt-6 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500">Load All Manages</button>
                        </div>
                        <div className="col-span-2">
                            <DataTable 
                                data={managesData} 
                                title="All Workshop-IC Management Links (Click to delete)" 
                                headerMap={{ WkshpID: 'Workshop Code', ICID: 'WIC ID' }}
                                onRowClick={handleManagesEntryDelete}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer with Developer Credits */}
            <Footer />
        </div>
    );
};

export default App;
