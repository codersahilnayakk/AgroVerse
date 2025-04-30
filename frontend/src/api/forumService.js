import axios from 'axios';

// Mock data for forum posts
let forumPosts = [
  {
    _id: '1',
    title: 'Best practices for organic farming',
    description: 'I recently started with organic farming and would like to know what are some best practices to follow. Has anyone had success with natural pest control methods?',
    author: {
      _id: '1',
      name: 'Rajesh Kumar'
    },
    user: {
      _id: '1',
      name: 'Rajesh Kumar'
    },
    category: 'Organic Farming',
    tags: ['organic', 'pest control', 'farming techniques'],
    comments: [
      {
        _id: '101',
        content: 'I use neem oil spray as a natural pesticide. It works great for most common pests and is completely organic.',
        comment: 'I use neem oil spray as a natural pesticide. It works great for most common pests and is completely organic.',
        author: {
          _id: '2',
          name: 'Sunita Sharma'
        },
        commenterId: '2',
        commenterName: 'Sunita Sharma',
        createdAt: '2023-07-12T14:30:00.000Z',
        updatedAt: '2023-07-12T14:30:00.000Z',
        upvotes: 5,
        downvotes: 0,
        userVote: null
      },
      {
        _id: '102',
        content: 'Crop rotation is essential for organic farming. I rotate my crops every season and have seen significant improvement in soil health and reduced pest problems.',
        comment: 'Crop rotation is essential for organic farming. I rotate my crops every season and have seen significant improvement in soil health and reduced pest problems.',
        author: {
          _id: '3',
          name: 'Ramesh Patel'
        },
        commenterId: '3',
        commenterName: 'Ramesh Patel',
        createdAt: '2023-07-13T09:15:00.000Z',
        updatedAt: '2023-07-13T09:15:00.000Z',
        upvotes: 3,
        downvotes: 0,
        userVote: null
      }
    ],
    createdAt: '2023-07-10T11:30:00.000Z',
    updatedAt: '2023-07-10T11:30:00.000Z',
    upvotes: 12,
    downvotes: 2,
    views: 156,
    userVote: null
  },
  {
    _id: '2',
    title: 'Water conservation techniques for summer season',
    description: 'With the summer approaching, I am looking for effective water conservation techniques. What methods are you using to reduce water usage while maintaining crop health?',
    author: {
      _id: '2',
      name: 'Sunita Sharma'
    },
    user: {
      _id: '2',
      name: 'Sunita Sharma'
    },
    category: 'Water Management',
    tags: ['water conservation', 'summer', 'irrigation'],
    comments: [
      {
        _id: '201',
        content: 'I have implemented drip irrigation in my farm and it has reduced my water usage by almost 60%. Initial setup cost is high but worth it in the long run.',
        comment: 'I have implemented drip irrigation in my farm and it has reduced my water usage by almost 60%. Initial setup cost is high but worth it in the long run.',
        author: {
          _id: '1',
          name: 'Rajesh Kumar'
        },
        commenterId: '1',
        commenterName: 'Rajesh Kumar',
        createdAt: '2023-06-05T16:45:00.000Z',
        updatedAt: '2023-06-05T16:45:00.000Z',
        upvotes: 8,
        downvotes: 0,
        userVote: null
      }
    ],
    createdAt: '2023-06-03T10:20:00.000Z',
    updatedAt: '2023-06-03T10:20:00.000Z',
    upvotes: 15,
    downvotes: 1,
    views: 203,
    userVote: null
  },
  {
    _id: '3',
    title: 'Market prices for wheat this season',
    description: 'Has anyone noticed the trend in wheat prices this season? The market seems volatile and I\'m trying to decide when to sell my harvest.',
    author: {
      _id: '3',
      name: 'Ramesh Patel'
    },
    user: {
      _id: '3',
      name: 'Ramesh Patel'
    },
    category: 'Market Prices',
    tags: ['wheat', 'market', 'pricing'],
    comments: [],
    createdAt: '2023-05-25T09:10:00.000Z',
    updatedAt: '2023-05-25T09:10:00.000Z',
    upvotes: 9,
    downvotes: 0,
    views: 178,
    userVote: null
  },
  {
    _id: '4',
    title: 'Recommendations for soil testing services',
    description: 'I need to get my soil tested before the next planting season. Can anyone recommend reliable soil testing services or labs in Maharashtra?',
    author: {
      _id: '4',
      name: 'Anjali Desai'
    },
    user: {
      _id: '4',
      name: 'Anjali Desai'
    },
    category: 'Soil Health',
    tags: ['soil testing', 'Maharashtra', 'labs'],
    comments: [
      {
        _id: '401',
        content: 'The Agricultural University in Pune offers affordable and accurate soil testing. I got mine done last month and they also provided recommendations based on the results.',
        comment: 'The Agricultural University in Pune offers affordable and accurate soil testing. I got mine done last month and they also provided recommendations based on the results.',
        author: {
          _id: '1',
          name: 'Rajesh Kumar'
        },
        commenterId: '1',
        commenterName: 'Rajesh Kumar',
        createdAt: '2023-07-15T11:30:00.000Z',
        updatedAt: '2023-07-15T11:30:00.000Z',
        upvotes: 4,
        downvotes: 0,
        userVote: null
      },
      {
        _id: '402',
        content: 'You can also check with your local Krishi Vigyan Kendra. They offer soil testing at subsidized rates for farmers.',
        comment: 'You can also check with your local Krishi Vigyan Kendra. They offer soil testing at subsidized rates for farmers.',
        author: {
          _id: '2',
          name: 'Sunita Sharma'
        },
        commenterId: '2',
        commenterName: 'Sunita Sharma',
        createdAt: '2023-07-15T13:45:00.000Z',
        updatedAt: '2023-07-15T13:45:00.000Z',
        upvotes: 3,
        downvotes: 0,
        userVote: null
      }
    ],
    createdAt: '2023-07-14T16:20:00.000Z',
    updatedAt: '2023-07-14T16:20:00.000Z',
    upvotes: 7,
    downvotes: 1,
    views: 124,
    userVote: null
  }
];

// Mock forum service
const forumService = {
  // Get all forum posts
  getPosts: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(forumPosts);
      }, 500);
    });
  },

  getForumPosts: async () => {
    // Alias for getPosts to maintain compatibility
    return forumService.getPosts();
  },

  // Get a specific forum post by ID
  getPostById: async (id) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = forumPosts.find(post => post._id === id);
        if (post) {
          resolve({...post});
        } else {
          reject(new Error('Post not found'));
        }
      }, 500);
    });
  },

  getForumPostById: async (id) => {
    // Alias for getPostById to maintain compatibility
    return forumService.getPostById(id);
  },

  // Create a new forum post
  createPost: async (postData, token) => {
    // Create new post
    const newPost = {
      _id: Date.now().toString(),
      ...postData,
      author: {
        _id: '1',
        name: 'Rajesh Kumar' // Simulating logged-in user
      },
      user: {
        _id: '1',
        name: 'Rajesh Kumar' // Maintaining compatibility
      },
      comments: [],
      upvotes: 0,
      downvotes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        forumPosts.unshift(newPost);
        resolve(newPost);
      }, 500);
    });
  },

  createForumPost: async (postData, token) => {
    // Alias for createPost to maintain compatibility
    return forumService.createPost(postData, token);
  },

  // Update a forum post
  updatePost: async (id, postData, token) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = forumPosts.findIndex(post => post._id === id);
        if (postIndex !== -1) {
          forumPosts[postIndex] = {
            ...forumPosts[postIndex],
            ...postData,
            updatedAt: new Date().toISOString()
          };
          resolve(forumPosts[postIndex]);
        } else {
          reject(new Error('Post not found'));
        }
      }, 500);
    });
  },

  // Delete a forum post
  deletePost: async (id, token) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        forumPosts = forumPosts.filter(post => post._id !== id);
        resolve({ success: true });
      }, 500);
    });
  },

  deleteForumPost: async (id, token) => {
    // Alias for deletePost to maintain compatibility
    return forumService.deletePost(id, token);
  },

  // Vote on a post
  votePost: async (id, voteType, token) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = forumPosts.findIndex(post => post._id === id);
        if (postIndex !== -1) {
          const post = forumPosts[postIndex];
          const currentVote = post.userVote;

          // Update vote counts based on vote type and current user's vote
          if (currentVote === voteType) {
            // Cancel vote
            if (voteType === 'upvote') post.upvotes = Math.max(0, post.upvotes - 1);
            if (voteType === 'downvote') post.downvotes = Math.max(0, post.downvotes - 1);
            post.userVote = null;
          } else if (currentVote === null) {
            // New vote
            if (voteType === 'upvote') post.upvotes += 1;
            if (voteType === 'downvote') post.downvotes += 1;
            post.userVote = voteType;
          } else {
            // Change vote from one type to another
            if (currentVote === 'upvote' && voteType === 'downvote') {
              post.upvotes = Math.max(0, post.upvotes - 1);
              post.downvotes += 1;
            } else if (currentVote === 'downvote' && voteType === 'upvote') {
              post.downvotes = Math.max(0, post.downvotes - 1);
              post.upvotes += 1;
            }
            post.userVote = voteType;
          }

          resolve({...post});
        } else {
          reject(new Error('Post not found'));
        }
      }, 500);
    });
  },

  // Like a forum post (for compatibility)
  likeForumPost: async (id, token) => {
    return forumService.votePost(id, 'upvote', token);
  },

  // Add a comment to a post
  addComment: async (postId, commentData, token) => {
    // Create new comment
    const newComment = {
      _id: Date.now().toString(),
      content: commentData.content,
      comment: commentData.content, // For backward compatibility
      author: {
        _id: '1',
        name: 'Rajesh Kumar' // Simulating logged-in user
      },
      commenterId: '1',
      commenterName: 'Rajesh Kumar', // For backward compatibility
      parentId: commentData.parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null
    };
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = forumPosts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          // If it's a reply to another comment
          if (newComment.parentId) {
            const parentCommentIndex = forumPosts[postIndex].comments.findIndex(
              comment => comment._id === newComment.parentId
            );
            
            if (parentCommentIndex !== -1) {
              if (!forumPosts[postIndex].comments[parentCommentIndex].replies) {
                forumPosts[postIndex].comments[parentCommentIndex].replies = [];
              }
              forumPosts[postIndex].comments[parentCommentIndex].replies.push(newComment);
            } else {
              // Parent comment not found, add as regular comment
              forumPosts[postIndex].comments.push(newComment);
            }
          } else {
            // Regular comment
            forumPosts[postIndex].comments.push(newComment);
          }
          
          resolve(newComment);
        } else {
          reject(new Error('Post not found'));
        }
      }, 500);
    });
  },

  // Vote on a comment
  voteComment: async (postId, commentId, voteType, token) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = forumPosts.findIndex(post => post._id === postId);
        if (postIndex === -1) {
          reject(new Error('Post not found'));
          return;
        }
        
        // Find the comment (either top-level or in replies)
        let foundComment = null;
        let isReply = false;
        let parentCommentIndex = -1;
        let replyIndex = -1;
        
        // Search in top-level comments
        const commentIndex = forumPosts[postIndex].comments.findIndex(
          comment => comment._id === commentId
        );
        
        if (commentIndex !== -1) {
          foundComment = forumPosts[postIndex].comments[commentIndex];
        } else {
          // Search in replies
          for (let i = 0; i < forumPosts[postIndex].comments.length; i++) {
            const comment = forumPosts[postIndex].comments[i];
            if (comment.replies && comment.replies.length > 0) {
              replyIndex = comment.replies.findIndex(reply => reply._id === commentId);
              if (replyIndex !== -1) {
                foundComment = comment.replies[replyIndex];
                isReply = true;
                parentCommentIndex = i;
                break;
              }
            }
          }
        }
        
        if (!foundComment) {
          reject(new Error('Comment not found'));
          return;
        }
        
        // Update the vote
        const currentVote = foundComment.userVote;
        
        // Update vote counts based on vote type and current user's vote
        if (currentVote === voteType) {
          // Cancel vote
          if (voteType === 'upvote') foundComment.upvotes = Math.max(0, foundComment.upvotes - 1);
          if (voteType === 'downvote') foundComment.downvotes = Math.max(0, foundComment.downvotes - 1);
          foundComment.userVote = null;
        } else if (currentVote === null) {
          // New vote
          if (voteType === 'upvote') foundComment.upvotes += 1;
          if (voteType === 'downvote') foundComment.downvotes += 1;
          foundComment.userVote = voteType;
        } else {
          // Change vote from one type to another
          if (currentVote === 'upvote' && voteType === 'downvote') {
            foundComment.upvotes = Math.max(0, foundComment.upvotes - 1);
            foundComment.downvotes += 1;
          } else if (currentVote === 'downvote' && voteType === 'upvote') {
            foundComment.downvotes = Math.max(0, foundComment.downvotes - 1);
            foundComment.upvotes += 1;
          }
          foundComment.userVote = voteType;
        }
        
        // Update the comment in the post
        if (isReply) {
          forumPosts[postIndex].comments[parentCommentIndex].replies[replyIndex] = foundComment;
        } else {
          forumPosts[postIndex].comments[commentIndex] = foundComment;
        }
        
        resolve({...foundComment});
      }, 500);
    });
  },

  // Like a comment (for compatibility)
  likeComment: async (postId, commentId, token) => {
    return forumService.voteComment(postId, commentId, 'upvote', token);
  },

  // Delete a comment
  deleteComment: async (postId, commentId, token) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = forumPosts.findIndex(post => post._id === postId);
        if (postIndex === -1) {
          reject(new Error('Post not found'));
          return;
        }
        
        let commentFound = false;
        
        // Check if it's a top-level comment
        const commentIndex = forumPosts[postIndex].comments.findIndex(
          comment => comment._id === commentId
        );
        
        if (commentIndex !== -1) {
          forumPosts[postIndex].comments.splice(commentIndex, 1);
          commentFound = true;
        } else {
          // Check if it's a reply
          for (let i = 0; i < forumPosts[postIndex].comments.length; i++) {
            const comment = forumPosts[postIndex].comments[i];
            if (comment.replies && comment.replies.length > 0) {
              const replyIndex = comment.replies.findIndex(reply => reply._id === commentId);
              if (replyIndex !== -1) {
                forumPosts[postIndex].comments[i].replies.splice(replyIndex, 1);
                commentFound = true;
                break;
              }
            }
          }
        }
        
        if (!commentFound) {
          reject(new Error('Comment not found'));
          return;
        }
        
        resolve(true);
      }, 500);
    });
  },

  // Mark a comment as answer
  markCommentAsAnswer: async (postId, commentId, token) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = forumPosts.findIndex(post => post._id === postId);
        if (postIndex === -1) {
          reject(new Error('Post not found'));
          return;
        }
        
        const commentIndex = forumPosts[postIndex].comments.findIndex(
          comment => comment._id === commentId
        );
        
        if (commentIndex === -1) {
          reject(new Error('Comment not found'));
          return;
        }
        
        // Mark the comment as answer
        forumPosts[postIndex].comments[commentIndex].isAnswer = true;
        forumPosts[postIndex].hasAcceptedAnswer = true;
        
        resolve({...forumPosts[postIndex]});
      }, 500);
    });
  },

  // Report a post
  reportPost: async (postId, reportData, token) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Post reported successfully' });
      }, 500);
    });
  }
};

export default forumService; 