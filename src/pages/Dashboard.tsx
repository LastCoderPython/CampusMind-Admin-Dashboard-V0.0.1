// src/pages/Dashboard.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ScreeningAnalytics from '../components/ScreeningAnalytics';
import AppointmentAnalytics from '../components/AppointmentAnalytics';

// --- MUI Imports: Values ---
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, CssBaseline, Button, Divider, IconButton, CircularProgress } from '@mui/material';

// --- MUI Imports: Types ---
import type { Theme, CSSObject } from '@mui/material/styles';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

// --- ICONS ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MenuIcon from '@mui/icons-material/Menu';

// --- Constants ---
const TABS = {
  DASHBOARD: 'Dashboard',
  SCREENING: 'Screening Analytics',
  APPOINTMENTS: 'Appointment Analytics',
};
const drawerWidth = 240;

// --- STYLED COMPONENTS ---
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

// ==============================|| ENHANCED DASHBOARD ||============================== //

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.SCREENING:
        return <ScreeningAnalytics isLoading={false} />;
      case TABS.APPOINTMENTS:
        return <AppointmentAnalytics isLoading={false} />;
      default:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ScreeningAnalytics isLoading={false} />
            <AppointmentAnalytics isLoading={false} />
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 5 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            CampusMind Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? <CircularProgress size={24} color="inherit" /> : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton selected={activeTab === TABS.DASHBOARD} onClick={() => setActiveTab(TABS.DASHBOARD)} sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary={TABS.DASHBOARD} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton selected={activeTab === TABS.SCREENING} onClick={() => setActiveTab(TABS.SCREENING)} sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}><AssessmentIcon /></ListItemIcon>
                <ListItemText primary="Screenings" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton selected={activeTab === TABS.APPOINTMENTS} onClick={() => setActiveTab(TABS.APPOINTMENTS)} sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}><EventAvailableIcon /></ListItemIcon>
                <ListItemText primary="Appointments" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
