// src/components/AppointmentAnalytics.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the shape of the data we expect
interface StatusData {
  status: string;
  count: number;
}

// Define the shape of the data for Chart.js
type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
} | null;

export default function AppointmentAnalytics() {
  const [statusData, setStatusData] = useState<ChartData>(null);

  useEffect(() => {
    // FIX: Corrected the function name from 'get_appointment_by_status' to 'get_appointments_by_status'
    supabase.rpc('get_appointments_by_status').then(({ data }) => {
      const typedData = data as StatusData[];
      if (typedData) {
        setStatusData({
          labels: typedData.map(d => d.status),
          datasets: [{
            data: typedData.map(d => d.count),
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',  // Blue
              'rgba(75, 192, 192, 0.6)',  // Green
              'rgba(255, 99, 132, 0.6)',   // Red
            ],
          }],
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>Appointment Analytics</h1>
      <div style={{ width: '400px', margin: '2rem auto' }}>
        <h2>Appointments by Status</h2>
        {statusData ? (
          <Pie 
            data={statusData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Distribution of Appointment Statuses' }
              }
            }}
          />
        ) : (
          <p>Loading appointment data...</p>
        )}
      </div>
    </div>
  );
}
