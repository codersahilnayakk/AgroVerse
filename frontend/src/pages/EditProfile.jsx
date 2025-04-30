import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import authService from '../services/authService';

function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    crops: []
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const cropOptions = [
    'Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Pulses', 
    'Soybeans', 'Fruits', 'Vegetables', 'Oilseeds'
  ];

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to edit your profile');
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const userData = await authService.getCurrentUser();
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          farmSize: userData.farmSize || '',
          crops: userData.crops || []
        });
        setImagePreview(userData.profilePicture || null);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load profile data');
        setIsLoading(false);
        navigate('/profile');
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCropChange = (e) => {
    const { value } = e.target;
    const updatedCrops = [...profileData.crops];
    
    // Check if crop already exists
    const cropIndex = updatedCrops.indexOf(value);
    
    if (cropIndex === -1) {
      // Add crop if not already in the list
      updatedCrops.push(value);
    } else {
      // Remove crop if already in the list
      updatedCrops.splice(cropIndex, 1);
    }
    
    setProfileData(prevData => ({
      ...prevData,
      crops: updatedCrops
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Please upload an image file (jpg or png)');
      return;
    }
    
    setProfileImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (profileData.name.trim() === '') {
      toast.error('Name is required');
      return;
    }
    
    setIsSaving(true);
    try {
      // Update profile information
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      
      // Upload profile image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append('profilePicture', profileImage);
        await authService.uploadProfilePicture(formData);
      }
      
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSaving(true);
    try {
      await authService.updatePassword(passwordData);
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password. Please check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="edit-profile-container container my-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Edit Profile</h2>
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
            </li>
          </ul>
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <div className="row">
                <div className="col-md-4 mb-4 text-center">
                  <div className="position-relative d-inline-block">
                    <img 
                      src={imagePreview || 'https://via.placeholder.com/150'} 
                      alt="Profile" 
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <label htmlFor="profile-image" className="btn btn-sm btn-primary position-absolute bottom-0 end-0">
                      <FaCamera />
                      <input 
                        type="file" 
                        id="profile-image" 
                        className="d-none" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-muted small">Click the icon to change your profile picture</p>
                </div>
                
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      <FaUser className="me-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope className="me-2" /> Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={profileData.email}
                      readOnly
                      disabled
                    />
                    <small className="text-muted">Email cannot be changed</small>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      <FaPhone className="me-2" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      <FaMapMarkerAlt className="me-2" /> Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="Your city, state or district"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="farmSize" className="form-label">
                      Farm Size (acres)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="farmSize"
                      name="farmSize"
                      value={profileData.farmSize}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      Crops You Grow
                    </label>
                    <div className="row">
                      {cropOptions.map((crop, index) => (
                        <div className="col-md-4 mb-2" key={index}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`crop-${index}`}
                              value={crop}
                              checked={profileData.crops.includes(crop)}
                              onChange={handleCropChange}
                            />
                            <label className="form-check-label" htmlFor={`crop-${index}`}>
                              {crop}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-end mt-3">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={() => navigate('/profile')}
                >
                  <FaTimes className="me-1" /> Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  <FaSave className="me-1" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
                <small className="text-muted">
                  Password must be at least 6 characters long
                </small>
              </div>
              
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="d-flex justify-content-end mt-3">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setActiveTab('profile');
                  }}
                >
                  <FaTimes className="me-1" /> Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  <FaSave className="me-1" /> {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile; 