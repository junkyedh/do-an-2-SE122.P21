import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppSystemContextValue {
    isLoggedIn: boolean;
    token: string;
    role: string;
    setToken: (token: string) => void;
    setRole: (role: string) => void;
    logout: () => void;
}

// Create the app system context
const AppSystemContext = createContext<AppSystemContextValue | undefined>(undefined);

// Create a custom hook to access the app system context
export const useSystemContext = () => {
    const context = useContext(AppSystemContext);
    if (!context) {
        throw new Error('useSystemContext must be used within an AppSystemProvider');
    }
    return context;
};

// Create a provider component to wrap your app with the app system context
export const AppSystemProvider = ({ children }: any) => {
    // Add your app system state and methods here
    // For example:
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [token, setTokenState] = useState('');
    const [role, setRoleState] = useState('');

    const setToken = (token: string) => {
        setTokenState(token);
        localStorage.setItem('token', token); // Lưu token vào localStorage
    };

    const setRole = (role: string) => {
        setRoleState(role);
        localStorage.setItem('role', role); // Lưu role vào localStorage
    };

    const logout = () => {
        setIsLoggedIn(false);
        setToken('');
        setRole('');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    // Provide the app system context value to the children components
    const appSystemContextValue: AppSystemContextValue = {
        isLoggedIn,
        token,
        role,
        setRole,
        setToken,
        logout,
    };

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            setRole(role);
            setToken(token);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token]);

    return (
        <AppSystemContext.Provider value={appSystemContextValue}>
            {children}
        </AppSystemContext.Provider>
    );
};