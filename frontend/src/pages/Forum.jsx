import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaFilter, FaSearch, FaThumbsUp, FaEye, FaTag } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import ForumPostCard from '../components/ForumPostCard';
import Spinner from '../components/Spinner';
import forumService from '../services/forumService';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = [
    "all",
    "Crop Production",
    "Livestock",
    "Farm Equipment",
    "Market Trends",
    "Schemes & Subsidies",
    "Weather",
    "Pest Control",
    "Soil Management",
    "General Discussion"
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await forumService.getPosts();
        setPosts(data);
        setFilteredPosts(data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching forum posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [activeCategory, searchQuery, posts]);

  const filterPosts = () => {
    let result = [...posts];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((post) => post.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    setFilteredPosts(result);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setFilterOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterPosts();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4 md:mb-0">Farmer Community Forum</h1>
        {user && (
          <Link
            to="/forum/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            <FaPlus /> Create New Post
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-grow">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search forum posts..."
              className="border border-gray-300 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-r-md px-4 py-2"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Filter Button (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md"
          >
            <FaFilter /> Filter by Category
          </button>
        </div>

        {/* Categories (Desktop) */}
        <div className="hidden md:flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Category Filter */}
      {filterOpen && (
        <div className="md:hidden mb-6 bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold mb-2">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No posts found for the current filters.</p>
          {user ? (
            <Link
              to="/forum/new"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              <FaPlus /> Start the conversation
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 underline"
            >
              Login to create posts
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/forum/post/${post._id}`} className="text-xl font-semibold text-green-700 hover:text-green-800">
                    {post.title}
                  </Link>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3 line-clamp-2">{post.description}</p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        <FaTag className="mr-1 text-gray-500" size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <FaThumbsUp className="mr-1" />
                      {post.likes ? post.likes.length : 0}
                    </span>
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {post.viewCount || 0}
                    </span>
                    <span>
                      {post.comments ? post.comments.length : 0} {post.comments && post.comments.length === 1 ? 'reply' : 'replies'}
                    </span>
                    {post.hasAcceptedAnswer && (
                      <span className="text-green-600 font-medium">
                        Solved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Posted by {post.user.name}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum; 