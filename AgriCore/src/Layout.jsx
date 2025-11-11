import React from 'react';
import { Outlet } from 'react-router';
import Nav from "./components/Navbar/Nav.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { InventoryProvider } from './context/InventoryContext.jsx';

const drawerWidth = 240;

function Layout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Nav />
            <Sidebar />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}/2px` }}
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
