import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../helper/config';

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
                // If it's an old mock user or missing candidate_id, clear it
                if (!parsedUser.candidate_id && parsedUser.role !== 'system_admin') {
                    console.warn("Old or invalid session found, clearing...");
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

    const login = async (email, password) => {
        try {
            // We'll try candidate login first as requested (super admin)
            // But usually we should know which role is logging in.
            // Since the LoginPage doesn't pass the role to the login function currently, 
            // we'll try to find which endpoint works, or better, we can modify the login call in LoginPage to pass the role.
            // However, looking at LoginPage.jsx, it doesn't pass the role.

            // Let's try to detect based on email or just try candidate first.
            let response;
            let data;

            // Try Candidate (Super Admin) login
            response = await fetch(`${config.pos_api_url}/api/candidates/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            data = await response.json();

            if (!response.ok) {
                // If candidate login fails, try Casior (Admin) login
                response = await fetch(`${config.pos_api_url}/api/casior/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                data = await response.json();
            }

            if (response.ok && data.success) {
                const userData = {
                    ...data.data.user,
                    role: data.data.role,
                    name: data.data.user.first_name + ' ' + (data.data.user.last_name || ''),
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
