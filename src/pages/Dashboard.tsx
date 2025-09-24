// src/pages/Dashboard.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ScreeningAnalytics from '../components/ScreeningAnalytics';
import AppointmentAnalytics from '../components/AppointmentAnalytics';
import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, AppBar, Typography, CssBaseline } from '@mui/material';

const TABS = ['Screening', 'Appointments'];
const drawerWidth = 240;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            CampusMind Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {TABS.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  selected={activeTab === text}
                  onClick={() => setActiveTab(text)}
                >
                  <ListItemText primary={`${text} Analytics`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
            <Button variant="outlined" fullWidth onClick={handleLogout}>Log Out</Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeTab === 'Screening' && <ScreeningAnalytics />}
        {activeTab === 'Appointments' && <AppointmentAnalytics />}
      </Box>
    </Box>
  );
}
