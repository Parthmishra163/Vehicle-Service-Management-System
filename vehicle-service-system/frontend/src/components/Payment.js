import React, { useState, useEffect } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
import axios from 'axios';  
import { Snackbar, Alert } from '@mui/material';  
import { useLocation } from 'react-router-dom';

function Payment() {
  const { issueId } = useParams();
  const location = useLocation(); 
  const [total, setTotal] = useState(location.state?.totalPrice || null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const navigate = useNavigate();

  const getCsrfToken = () => {
    return document.cookie.match(/csrftoken=([\w-]+)/)?.[1] || '';
  };

  useEffect(() => {
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
      setLoading(false);
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
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.paymentContainer}>
      <h2 style={styles.header}>Payment Summary</h2>
      <div style={styles.summary}>
        <p style={styles.totalAmount}>Total Amount Due: Rs{total?.toFixed(2)}</p>
        <button style={styles.button} onClick={handlePayment} disabled={!total}>
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

const styles = {
  paymentContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '20px',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  totalAmount: {
    fontSize: '18px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '20px',
  }
};

export default Payment;
