import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Nav from "./components/Navbar/Nav.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { InventoryProvider } from './context/InventoryContext.jsx';

const drawerWidth = 240;

function Layout() {
    const location = useLocation();
    const { username } = location.state || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Nav handleSidebarToggle={handleSidebarToggle} />
            <Sidebar username={username} sidebarOpen={sidebarOpen} handleSidebarToggle={handleSidebarToggle} />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, ml: sidebarOpen ? `${drawerWidth}px` : '0px', transition: 'margin-left 0.3s' }}
            >
                <Toolbar />
                <InventoryProvider>
                    <Outlet />
                </InventoryProvider>
            </Box>
        </Box>
    );
}

export default Layout;
