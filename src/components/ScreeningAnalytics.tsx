// src/components/ScreeningAnalytics.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// Define the shape of the data we expect from our database functions
interface DistributionData {
  severity_level: string;
  result_count: number;
}

interface DailyVolumeData {
  date: string;
  count: number;
}

// Define the shape of the data for Chart.js
type ChartData = {
  labels: string[];
  datasets: any[];
} | null;

export default function ScreeningAnalytics() {
  const [distributionData, setDistributionData] = useState<ChartData>(null);
  const [dailyVolumeData, setDailyVolumeData] = useState<ChartData>(null);

  useEffect(() => {
    // Fetch distribution data
    supabase.rpc('get_screening_distribution').then(({ data }) => {
      // Tell TypeScript to trust that 'data' matches our 'DistributionData' interface
      const typedData = data as DistributionData[];
      if (typedData) {
        setDistributionData({
          labels: typedData.map(d => d.severity_level),
          datasets: [{ label: 'Score Distribution', data: typedData.map(d => d.result_count), backgroundColor: 'rgba(75, 192, 192, 0.6)' }],
        });
      }
    });

    // Fetch daily volume data
    supabase.rpc('get_daily_screening_volume').then(({ data }) => {
      // Tell TypeScript to trust that 'data' matches our 'DailyVolumeData' interface
      const typedData = data as DailyVolumeData[];
      if (typedData) {
        setDailyVolumeData({
          labels: typedData.map(d => new Date(d.date).toLocaleDateString()),
          datasets: [{ label: 'Screenings per Day', data: typedData.map(d => d.count), fill: false, borderColor: 'rgb(255, 99, 132)' }],
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>Screening Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2>Score Distribution</h2>
          {distributionData ? <Bar data={distributionData} /> : <p>Loading...</p>}
        </div>
        <div>
          <h2>Daily Volume</h2>
          {dailyVolumeData ? <Line data={dailyVolumeData} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}
