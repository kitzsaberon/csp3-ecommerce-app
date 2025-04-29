import { useState, useEffect } from 'react';



export default function UpdateProfile( {onUpdate} ) {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNo: ''
      });

      useEffect(() => {
        const loadProfile = async () => {
          try {
            const res = await fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/users/details', {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            const data = await res.json();
            if (res.ok && data) {
              setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                mobileNo: data.mobileNo || ''
              });
            } else {
              alert(data.message || 'Failed to load profile.');
            }
          } catch (err) {
            alert('Failed to fetch profile details:');
            alert('An error occurred while loading profile.');
          }
        };
    
        loadProfile();
      }, []);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [id]: value
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const res = await fetch('http://localhost:4000/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
          });
    
          const data = await res.json();
          if (res.ok) {
           alert('Profile updated successfully!');
            if (onUpdate) onUpdate();
          } else {
            alert(data.message || 'Failed to update profile.');
          }
        } catch (err) {
          console.error('Update failed:', err);
          alert('An error occurred.');
        }
      }

      
      return (
        <div className="container my-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title mb-4 text-center">Update Profile</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
    
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
    
                    <div className="mb-3">
                      <label htmlFor="mobileNo" className="form-label">Mobile No</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
    
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
