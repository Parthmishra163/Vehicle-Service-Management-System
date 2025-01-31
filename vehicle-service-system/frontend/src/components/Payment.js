import React, { useState, useEffect } from 'react';  // Importing useState, useEffect from React
import { useParams, useNavigate } from 'react-router-dom';  // Importing useParams and useNavigate for navigation and parameter handling
import axios from 'axios';  // Importing axios for API calls
import { Snackbar, Alert } from '@mui/material';  // Importing Snackbar and Alert from Material-UI for displaying messages

import { useLocation } from 'react-router-dom';

function Payment() {
  const { issueId } = useParams();
  const location = useLocation(); // Use location to get state
  const [total, setTotal] = useState(location.state?.totalPrice || null); // Set total from state or fetch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const navigate = useNavigate();

  const getCsrfToken = () => {
    return document.cookie.match(/csrftoken=([\w-]+)/)?.[1] || '';
  };

  useEffect(() => {
    // If no total from state, fetch it
    if (!total) {
      const fetchTotal = async () => {
        try {
          if (!issueId || isNaN(issueId)) {
            throw new Error('Invalid service request ID');
          }

          const response = await axios.get(
            `http://localhost:8000/api/issues/${issueId}/calculate_total/`,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          setTotal(response.data.total);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to load payment details');
        } finally {
          setLoading(false);
        }
      };

      fetchTotal();
    } else {
      setLoading(false); // If total is passed in, no need to fetch
    }
  }, [issueId, total]);

  const handlePayment = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/issues/${issueId}/pay/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          }
        }
      );
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment processing failed');
    }
  };

  if (loading) return <div>Loading payment details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payment-container">
      <h2>Payment Summary</h2>
      <div className="summary">
        <p>Total Amount Due: ${total?.toFixed(2)}</p>
        <button onClick={handlePayment} disabled={!total}>
          Confirm Payment
        </button>
      </div>

      {/* Snackbar for payment success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Payment Successful! Redirecting to Dashboard...
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Payment;
