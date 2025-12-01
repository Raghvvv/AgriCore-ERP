import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Typography } from '@mui/material';

const drawerWidth = 240;

const menuItems = [
    { text: 'CROPS', path: '/app/crops', icon: <GrassIcon /> },
    { text: 'LIVESTOCK', path: '/app/livestock', icon: <AgricultureIcon /> },
    { text: 'FINANCE', path: '/app/finance', icon: <AttachMoneyIcon /> },
    { text: 'INVENTORY', path: '/app/inventory', icon: <InventoryIcon /> }
];

export default function Sidebar({ username, sidebarOpen, handleSidebarToggle }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8000/api/v1/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            navigate('/login');
        }
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="temporary"
            anchor="left"
            open={sidebarOpen}
            onClose={handleSidebarToggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
        >
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }} key={item.text}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={username || 'User'} />
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}