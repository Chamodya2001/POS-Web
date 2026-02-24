import React, { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../services/appService';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage on mount
        const savedUser = localStorage.getItem('pos_user');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Valid user must have either candidate_id (Super Admin) or casior_id (Admin)
                const isValidUser = parsedUser.candidate_id || parsedUser.casior_id || parsedUser.role === 'system_admin';

                if (!isValidUser) {
                    console.warn("Invalid session data found, clearing...");
                    localStorage.removeItem('pos_user');
                    setUser(null);
                } else {
                    setUser(parsedUser);
                }
            } catch (e) {
                localStorage.removeItem('pos_user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role = null) => {
        try {
            let data;

            // If a role is explicitly provided, use the corresponding endpoint
            if (role === 'super_admin') {
                data = await API.loginCandidate(email, password);
            } else if (role === 'admin') {
                data = await API.loginCasior(email, password);
            } else {
                // Fallback: try candidate first, then casior (original logic)
                try {
                    data = await API.loginCandidate(email, password);
                } catch (err) {
                    data = await API.loginCasior(email, password);
                }
            }

            if (data && data.success) {
                // Professional user mapping from DB tables
                const userData = {
                    ...data.data.user,
                    role: data.data.role,
                    // Handle name construction based on what's available in the table
                    name: data.data.user.first_name
                        ? (data.data.user.first_name + ' ' + (data.data.user.last_name || ''))
                        : (data.data.user.email.split('@')[0]),
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
                };

               

                setUser(userData);
                localStorage.setItem('pos_user', JSON.stringify(userData));
                return userData;
            } else {
                throw new Error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pos_user');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
