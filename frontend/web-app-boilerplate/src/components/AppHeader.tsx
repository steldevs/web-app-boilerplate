import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import SellIcon from '@mui/icons-material/Sell';
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import If from "../utils/If";
import { useDispatch } from "react-redux";
import { logoutUserState } from "../state/mainSlice";
import { logoutUser } from "../services/Auth.Service";
import { useNavigate } from "react-router-dom";


interface Props {
    isAuthenticated: boolean
}

const AppHeader = ({isAuthenticated} : Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);   
  
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const onLogout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut){
            dispatch(logoutUserState());
            return navigate("/login");
        }
    }

    return(
    <>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <If condition={isAuthenticated}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
            >
                <MenuIcon onClick={() => setOpenDrawer(true)}/>
            </IconButton>
            </If>
            
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}
            >
                WebApp Boilerplate
            </Typography>

            <If condition={isAuthenticated}>
                <div>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => onLogout()}>Logout</MenuItem>
                </Menu>
                </div>
            </If>
            </Toolbar>
        </AppBar>
        </Box>
        
        <If condition={isAuthenticated}>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        setOpenDrawer(false);
                    }} disabled>
                    <ListItemIcon>
                        <ScreenSearchDesktopIcon />
                    </ListItemIcon>
                    <ListItemText primary="Page 1 sample button" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        setOpenDrawer(false);
                    }} disabled>
                    <ListItemIcon>
                        <SellIcon />
                    </ListItemIcon>
                    <ListItemText primary="Page 2 sample button" />
                    </ListItemButton>
                </ListItem>
                </List>
            </Drawer>
        </If>

    </>
    )
}

export default AppHeader;