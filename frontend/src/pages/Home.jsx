import { Link } from 'react-router-dom';
import { FaSeedling, FaUsers, FaFileAlt } from 'react-icons/fa';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-50 py-12 px-4 rounded-lg mb-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Welcome to AgriConnect
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Empowering farmers with knowledge, community, and resources for
            sustainable agriculture
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Join Now
            </Link>
            <Link
              to="/schemes"
              className="bg-white hover:bg-gray-100 text-green-700 font-bold py-3 px-6 rounded-lg border border-green-500 transition duration-300"
            >
              Explore Schemes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Platform Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Crop Planning */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaSeedling className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Crop Planning & Advisory
            </h3>
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

          {/* Community Forum */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Farmer Community Forums
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with fellow farmers, share knowledge, ask questions, and
              learn from the community.
            </p>
            <Link
              to="/forum"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Join Discussion →
            </Link>
          </div>

          {/* Government Schemes */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaFileAlt className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Government Schemes & Subsidies
            </h3>
            <p className="text-gray-600 mb-4">
              Stay updated on the latest government schemes, subsidies, and
              benefits available for farmers.
            </p>
            <Link
              to="/schemes"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Explore Schemes →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 text-white py-12 px-4 rounded-lg mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow with AgriConnect?
          </h2>
          <p className="text-xl mb-6">
            Join our platform today and transform your farming practices with
            expert guidance and community support.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg inline-block transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home; 