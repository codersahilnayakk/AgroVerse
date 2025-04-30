import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaComments, FaFileAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome, {user?.name || 'Farmer'}
        </h1>
        <p className="text-gray-600">
          This is your dashboard where you can access all your farming resources
          and activities.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Quick Access Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            <FaSeedling className="text-3xl text-green-500 mr-3" />
            <h3 className="text-xl font-semibold">Crop Advisory</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get personalized crop recommendations based on your soil type,
            season, and water availability.
          </p>
          <Link
            to="/advisory"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Get Recommendations →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <FaComments className="text-3xl text-blue-500 mr-3" />
            <h3 className="text-xl font-semibold">Community Forum</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with other farmers, ask questions, and share your knowledge.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/forum"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Forum →
            </Link>
            <Link
              to="/forum/new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create Post →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <FaFileAlt className="text-3xl text-purple-500 mr-3" />
            <h3 className="text-xl font-semibold">Government Schemes</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Explore government schemes and subsidies available for farmers.
          </p>
          <Link
            to="/schemes"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            View Schemes →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard; 