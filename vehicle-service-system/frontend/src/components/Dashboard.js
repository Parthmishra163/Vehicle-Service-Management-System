import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [revenueData, setRevenueData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/payments/revenue/', {
          params: { timeFrame }
        });
        console.log(response)

        // Format the data to match the chart expectations
        const formattedData = response.data.map(item => ({
          date: new Date(item.period).toLocaleDateString(), // Format the date
          amount: item.total_revenue
        }));
        
        setRevenueData(formattedData);
      } catch (err) {
        setError('Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [timeFrame]);

  if (loading) return <div>Loading revenue data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Revenue Analysis</h2>
      <div className="timeframe-selector">
        <button 
          onClick={() => setTimeFrame('daily')}
          className={timeFrame === 'daily' ? 'active' : ''}
        >
          Daily
        </button>
        {/* <button 
          onClick={() => setTimeFrame('monthly')}
          className={timeFrame === 'monthly' ? 'active' : ''}
        >
          Monthly
        </button>
        <button 
          onClick={() => setTimeFrame('yearly')}
          className={timeFrame === 'yearly' ? 'active' : ''}
        >
          Yearly
        </button> */}
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={revenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              label={{ value: 'Date', position: 'bottom', offset: 0 }} 
            />
            <YAxis 
              label={{ value: 'Amount (Rs)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
