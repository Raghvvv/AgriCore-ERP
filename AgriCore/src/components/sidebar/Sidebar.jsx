import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

const drawerWidth = 240;

const menuItems = [
    { text: 'CROPS', path: '/crops', icon: <GrassIcon /> },
    { text: 'LIVESTOCK', path: '/livestock', icon: <AgricultureIcon /> },
    { text: 'FINANCE', path: '/finance', icon: <AttachMoneyIcon /> },
    { text: 'INVENTORY', path: '/inventory', icon: <InventoryIcon /> }
];

export default function Sidebar() {
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
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem key={item.text} disablePadding>
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
        </Drawer>
    );
}