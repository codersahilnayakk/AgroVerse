import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTractor, FaEdit, FaCamera } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import forumService from '../services/forumService';
import schemeService from '../services/schemeService';
import { getFullImageUrl } from '../utils/imageUtils';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    crops: '',
    profilePicture: '',
    bio: ''
  });
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [userSchemeBookmarks, setUserSchemeBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        farmSize: user.farmSize || '',
        crops: user.crops || '',
        profilePicture: user.profilePicture || '',
        bio: user.bio || ''
      });
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        farmSize: user.farmSize || '',
        crops: user.crops || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user forum posts
        const postsData = await forumService.getUserPosts(user._id);
        setUserPosts(postsData);
        
        // Fetch user forum bookmarks
        const forumBookmarks = await forumService.getUserBookmarks();
        setUserBookmarks(forumBookmarks);
        
        // Fetch user scheme applications
        const applications = await schemeService.getUserApplications();
        setUserApplications(applications);
        
        // Fetch user scheme bookmarks
        const schemeBookmarks = await schemeService.getUserBookmarks();
        setUserSchemeBookmarks(schemeBookmarks);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = profileData.profilePicture;
      
      // Upload new profile image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);
        const response = await forumService.uploadImage(formData);
        imageUrl = response.url;
      }
      
      // Update profile with form data and new image URL
      const updatedProfile = await updateProfile({
        ...formData,
        profilePicture: imageUrl
      });
      
      setProfileData({
        name: updatedProfile.name || '',
        email: updatedProfile.email || '',
        phone: updatedProfile.phone || '',
        location: updatedProfile.location || '',
        farmSize: updatedProfile.farmSize || '',
        crops: updatedProfile.crops || '',
        profilePicture: updatedProfile.profilePicture || '',
        bio: updatedProfile.bio || ''
      });
      
      setEditing(false);
      setPreviewImage(null);
      setProfileImage(null);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (authLoading || !user) {
    return <Spinner text="Loading profile..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
      
      {/* Profile Tabs */}
      <div className="mb-6 border-b overflow-x-auto scrollbar-hide">
        <nav className="flex space-x-8 whitespace-nowrap pb-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 ${
              activeTab === 'profile'
                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-4 px-1 ${
              activeTab === 'posts'
                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Your Posts
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-4 px-1 ${
              activeTab === 'bookmarks'
                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bookmarks
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 px-1 ${
              activeTab === 'applications'
                ? 'border-b-2 border-green-600 text-green-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Scheme Applications
          </button>
        </nav>
      </div>
      
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center text-green-600 hover:text-green-700"
                    >
                      <FaEdit className="mr-1" /> Edit Profile
                    </button>
                  )}
                </div>
                
                {editing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6 flex flex-col items-center">
                      <div className="relative mb-3">
                        {previewImage || profileData.profilePicture ? (
                          <img
                            src={getFullImageUrl(previewImage || profileData.profilePicture)}
                            alt={profileData.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-green-50 shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-5xl font-bold border-4 border-green-50 shadow-sm">
                            {profileData.name ? profileData.name.charAt(0).toUpperCase() : <FaUser />}
                          </div>
                        )}
                        <label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer"
                        >
                          <FaCamera />
                          <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Village, District, State"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Farm Size (in acres)</label>
                        <input
                          type="text"
                          name="farmSize"
                          value={formData.farmSize}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Main Crops</label>
                        <input
                          type="text"
                          name="crops"
                          value={formData.crops}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g. Wheat, Rice, Cotton"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Tell us about yourself and your farming experience"
                      ></textarea>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setPreviewImage(null);
                          setProfileImage(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex flex-col md:flex-row">
                      <div className="mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
                        {profileData.profilePicture ? (
                          <img
                            src={getFullImageUrl(profileData.profilePicture)}
                            alt={profileData.name}
                            className="w-32 h-32 rounded-full object-cover mb-3 border-4 border-green-50 shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-5xl font-bold mb-3 border-4 border-green-50 shadow-sm">
                            {profileData.name ? profileData.name.charAt(0).toUpperCase() : <FaUser />}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center mb-4">
                              <FaUser className="text-green-600 mr-3 text-xl" />
                              <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-medium">{profileData.name || 'Not specified'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-4">
                              <FaEnvelope className="text-green-600 mr-3 text-xl" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{profileData.email || 'Not specified'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-4">
                              <FaPhone className="text-green-600 mr-3 text-xl" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{profileData.phone || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-4">
                              <FaMapMarkerAlt className="text-green-600 mr-3 text-xl" />
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{profileData.location || 'Not specified'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-4">
                              <FaTractor className="text-green-600 mr-3 text-xl" />
                              <div>
                                <p className="text-sm text-gray-500">Farm Size</p>
                                <p className="font-medium">
                                  {profileData.farmSize ? `${profileData.farmSize} acres` : 'Not specified'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a6 6 0 0 0 6 6v12H6V8a6 6 0 0 0 6-6z"></path>
                              </svg>
                              <div>
                                <p className="text-sm text-gray-500">Main Crops</p>
                                <p className="font-medium">{profileData.crops || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {profileData.bio && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-1">Bio</p>
                            <p className="text-gray-700">{profileData.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* User Posts */}
          {activeTab === 'posts' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
              {userPosts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">You haven't created any posts yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {userPosts.map(post => (
                    <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3">{post.content.substring(0, 150)}...</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{post.likes?.length || 0} likes</span>
                          <span className="text-sm text-gray-500">{post.comments?.length || 0} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Bookmarks</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Forum Posts</h3>
                {userBookmarks.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">You haven't bookmarked any forum posts yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userBookmarks.map(post => (
                      <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.content.substring(0, 150)}...</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            by {post.author?.name || 'Anonymous'} • {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Schemes</h3>
                {userSchemeBookmarks.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">You haven't bookmarked any schemes yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userSchemeBookmarks.map(scheme => (
                      <div key={scheme._id} className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{scheme.name}</h3>
                        <p className="text-gray-600 mb-3">{scheme.description.substring(0, 150)}...</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {scheme.department}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            scheme.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {scheme.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Scheme Applications */}
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Scheme Applications</h2>
              {userApplications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">You haven't applied for any schemes yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {userApplications.map(application => (
                    <div key={application._id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-800">{application.scheme?.name || 'Scheme'}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          application.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : application.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Applied on: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                      {application.feedback && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-700">Feedback:</p>
                          <p className="text-sm text-gray-600">{application.feedback}</p>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile; 