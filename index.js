const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const { error } = require("console");

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve static files

// GET - /api/posts - get all blog posts
app.get("/api/posts", async (req, res) => {
  try {
    // Read the data file
    const alldata = await fs.readFile(DATA_FILE, "utf8");
    // Parse the JSON data
    const blogPostData = JSON.parse(alldata);
    // Respond with the blog posts
    res.json(blogPostData.blogPosts);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.json([]);
    } else {
      res.status(500).json({ error: "Failed to read posts" });
    }
  }
});

// GET - /api/posts/:id - single blog post by index
app.get("/api/posts/:id", async (req, res) => {
  try {
    // Read the data file
    const alldata = await fs.readFile(DATA_FILE, "utf8");
    // Parse the JSON data
    const blogPostData = JSON.parse(alldata);
    // Get the post ID from the request parameters
    const blogPostId = parseInt(req.params.id);
    // Validate the post ID
    if (blogPostId < 0 || blogPostId >= blogPostData.blogPosts.length + 1) {
      error("Invalid Post Request");
      return res.status(404).json({ error: "Post not found" });
    }
    // Respond with the specific blog post
    res.json(blogPostData.blogPosts[blogPostId - 1]);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(500).json({ error: "Failed to read post" });
    }
  }
});

// POST - /api/posts - create new blog post
app.post("/api/posts", async (req, res) => {
  try {
    // Extract blog post data from the request body
    const { blogTitle, blogContent, blogAuthor, createdAt } = req.body;
    // Basic validation
    if (!blogTitle || !blogContent || !blogAuthor || !createdAt) {
      return res
        .status(400)
        .json({ error: "You gotta fill in everything man" });
    }
    // Read existing blog data or initialize if file does not exist
    let blogData;

    // Attempt to read the data file
    try {
      // Read the data file
      const alldata = await fs.readFile(DATA_FILE, "utf8");
      // Parse the JSON data
      blogData = JSON.parse(alldata);
    } catch (error) {
      if (error.code === "ENOENT") {
        blogData = { blogPosts: [] };
      } else {
        throw error;
      }
    }

    // Create a new blog post object
    const newPost = {
      blogTitle,
      blogContent,
      blogAuthor,
      createdAt,
    };

    // Assign the blog post data to the new post object
    blogData.blogPosts.push(newPost);
    // Write the updated blog data back to the file
    await fs.writeFile(DATA_FILE, JSON.stringify(blogData));
    res.json({ post: newPost });
    // Respond with success message and the new post
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT - /api/posts/:id - update existing blog post
app.put("/api/posts/:id", async (req, res) => {
  try {
    // Read the data file
    const alldata = await fs.readFile(DATA_FILE, "utf8");
    // Parse the JSON data
    const blogPostData = JSON.parse(alldata);
    // Get the post ID from the request parameters
    const postID = parseInt(req.params.id);
    // Validate the post ID
    if (postID < 0 || postID >= blogPostData.blogPosts.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Extract blog post data from the request body
    const { blogTitle, blogContent, blogAuthor, createdAt } = req.body;

    // Basic validation
    if (!blogTitle || !blogContent || !blogAuthor || !createdAt) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update the specific blog post
    blogPostData.blogPosts[postID] = {
      blogTitle,
      blogContent,
      blogAuthor,
      createdAt,
    };

    // Write the updated blog data back to the file
    await fs.writeFile(DATA_FILE, JSON.stringify(blogPostData));
    // Respond with success message and the updated post
    res.json({
      success: "post replaced.",
      post: blogPostData.blogPosts.postID,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(500).json({ error: "Failed to update post" });
    }
  }
});

// DELETE - /api/posts/:id - delete blog post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    // Read the data file
    const alldata = await fs.readFile(DATA_FILE, "utf8");
    // Parse the JSON data
    const blogPostData = JSON.parse(alldata);
    // Get the post ID from the request parameters
    const postID = parseInt(req.params.id);
    // Validate the post ID
    if (postID < 0 || postID >= blogData.blogPosts.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the specific blog post
    const postToDestroy = blogPostData.blogPosts.splice(postID, 1);
    // Write the updated blog data back to the file
    await fs.writeFile(DATA_FILE, JSON.stringify(blogPostData));
    // Respond with success message and the deleted post
    res.json({ message: "eradicated", postToDestroy });
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
});

// BONUS: Search blog posts by title
// GET - /api/posts/search - search blog posts by title
app.get("/api/posts/search", async (req, res) => {
  try {
    // Read the data file
    // Parse the JSON data
    // Get the search query from the request query parameters
    // Filter the blog posts by title
    // Respond with the filtered blog posts
  } catch (error) {
    if (error.code === "ENOENT") {
      res.json([]);
    } else {
      res.status(500).json({ error: "Failed to search posts" });
    }
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Blog API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog API server running on http://localhost:${PORT}`);
});
