import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddIssue() {
  const [vehicles, setVehicles] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    vehicle: '',
    description: '',
    selectedComponents: [],
    useNewComponents: true
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesResponse, componentsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/vehicles/'),
          axios.get('http://localhost:8000/api/components/')
        ]);
        setVehicles(vehiclesResponse.data);
        setComponents(componentsResponse.data);
      } catch (err) {
        setError('Failed to load data. Please refresh the page.');
        console.error('Fetch error:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.vehicle || !formData.description || formData.selectedComponents.length === 0) {
        throw new Error('Please fill all required fields');
      }

      // Prepare request data
      const issueData = {
        vehicle: parseInt(formData.vehicle),
        description: formData.description,
        components: formData.selectedComponents,
        use_new_components: formData.useNewComponents
      };

      // Get CSRF token
      const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)?.[1] || '';

      // Create new issue
      const response = await axios.post(
        'http://localhost:8000/api/issues/',
        issueData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
          }
        }
      );

      // Handle successful creation
      if (response.data?.id) {
        navigate(`/payment/${response.data.id}`);
      } else {
        throw new Error('Failed to retrieve issue ID from server');
      }

    } catch (err) {
      setError(err.response?.data?.error || 
              err.response?.data?.message || 
              err.message || 
              'Failed to create issue. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <h2>Report Vehicle Issue</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vehicle">Select Vehicle</label>
          <select 
            id="vehicle"
            value={formData.vehicle} 
            onChange={e => setFormData({...formData, vehicle: e.target.value})}
            required
            disabled={loading}
          >
            <option value="">Select Vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} - {v.plate_number || v.vin}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Issue Description</label>
          <textarea
            id="description"
            placeholder="Describe the issue in detail"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="component-selection">
          <label className="component-toggle">
            <input
              type="checkbox"
              checked={formData.useNewComponents}
              onChange={e => setFormData({...formData, useNewComponents: e.target.checked})}
              disabled={loading}
            />
            Use New Components
          </label>

          <div className="components-list">
            {components.map(c => (
              <div key={c.id} className="component-item">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.selectedComponents.includes(c.id)}
                    onChange={e => {
                      const newSelection = e.target.checked
                        ? [...formData.selectedComponents, c.id]
                        : formData.selectedComponents.filter(id => id !== c.id);
                      setFormData({...formData, selectedComponents: newSelection});
                    }}
                    disabled={loading}
                  />
                  <span>{c.name} (${formData.useNewComponents ? c.new_price : c.repair_price})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.vehicle || !formData.description || formData.selectedComponents.length === 0}
          className="submit-button"
        >
          {loading ? (
            <span className="loading-indicator">Creating Issue...</span>
          ) : (
            'Continue to Payment'
          )}
        </button>
      </form>
    </div>
  );
}

export default AddIssue;