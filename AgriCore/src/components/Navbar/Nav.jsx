import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Nav({ handleSidebarToggle }) {
    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar sx={{color:"white"}}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleSidebarToggle}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: 24, sm: 30, md: 40 },
                        color:"white" // Responsive font size
                    }}
                >
                    AgriCore
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
