import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({ children }) {
    // const token = localStorage.getItem('bearer');

    // if (!token) {
    //     // If no token, redirect to the login page
    //     return <Navigate to="/login" />;
    // }

    // If token exists, render the child components (e.g., the Layout and its children)
    return children;
}

export default ProtectedRoutes;
