// src/components/AppointmentAnalytics.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, CircularProgress, Typography } from '@mui/material'; // Import MUI components

ChartJS.register(ArcElement, Tooltip, Legend);

// --- TYPE DEFINITIONS ---
interface StatusData {
  status: string;
  count: number;
}

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
} | null;

// --- COMPONENT DEFINITION ---
const AppointmentAnalytics = ({ isLoading }: { isLoading: boolean }) => {
  const [statusData, setStatusData] = useState<ChartData>(null);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    supabase.rpc('get_appointments_by_status').then(({ data }) => {
      const typedData = data as StatusData[];
      if (typedData) {
        setStatusData({
          labels: typedData.map(d => d.status),
          datasets: [{
            data: typedData.map(d => d.count),
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: '#fff',
            borderWidth: 1,
          }],
        });
      }
      setInternalLoading(false);
    });
  }, []);

  // Show a spinner if the parent or this component is loading
  if (isLoading || internalLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>Appointments by Status</Typography>
      {statusData ? (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Pie 
            data={statusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' as const },
                title: { display: false } // Title is handled by Typography
              }
            }}
          />
        </Box>
      ) : (
        <p>No appointment data available.</p>
      )}
    </Box>
  );
};

export default AppointmentAnalytics;
