// src/components/ScreeningAnalytics.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, CircularProgress, Typography } from '@mui/material'; // Import MUI components for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// --- TYPE DEFINITIONS ---
interface DistributionData {
  severity_level: string;
  result_count: number;
}

interface DailyVolumeData {
  date: string;
  count: number;
}

type ChartData = {
  labels: string[];
  datasets: any[];
} | null;

// --- COMPONENT DEFINITION ---
const ScreeningAnalytics = ({ isLoading }: { isLoading: boolean }) => {
  const [distributionData, setDistributionData] = useState<ChartData>(null);
  const [dailyVolumeData, setDailyVolumeData] = useState<ChartData>(null);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch both data points in parallel for efficiency
      const [distributionResult, volumeResult] = await Promise.all([
        supabase.rpc('get_screening_distribution'),
        supabase.rpc('get_daily_screening_volume')
      ]);

      const distributionTypedData = distributionResult.data as DistributionData[];
      if (distributionTypedData) {
        setDistributionData({
          labels: distributionTypedData.map(d => d.severity_level),
          datasets: [{ label: 'Score Distribution', data: distributionTypedData.map(d => d.result_count), backgroundColor: 'rgba(75, 192, 192, 0.6)' }],
        });
      }

      const volumeTypedData = volumeResult.data as DailyVolumeData[];
      if (volumeTypedData) {
        setDailyVolumeData({
          labels: volumeTypedData.map(d => new Date(d.date).toLocaleDateString()),
          datasets: [{ label: 'Screenings per Day', data: volumeTypedData.map(d => d.count), fill: false, borderColor: 'rgb(255, 99, 132)' }],
        });
      }
      
      setInternalLoading(false);
    };

    fetchData();
  }, []);

  // Use the parent's loading state OR this component's internal loading state
  if (isLoading || internalLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // The parent component provides the main title. We use Typography for sub-headings.
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '2rem' }}>
      <Box>
        <Typography variant="h6" gutterBottom align="center">Score Distribution</Typography>
        {distributionData ? <Bar data={distributionData} /> : <p>No distribution data available.</p>}
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom align="center">Daily Volume</Typography>
        {dailyVolumeData ? <Line data={dailyVolumeData} /> : <p>No volume data available.</p>}
      </Box>
    </Box>
  );
};

export default ScreeningAnalytics;
