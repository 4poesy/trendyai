import { Router } from "express";
import userService from "../services/userService.js";

const router = Router();

// GET /api/v1/users - Get all users
router.get("/", async (req, res) => {
  try {
    const result = await userService.getUsers();
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length,
      });
    }
    else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/v1/users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(id);
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
      });
    }
    else {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/v1/users - Create new user
router.post("/", async (req, res) => {
  try {
    const userData = req.body;
    const result = await userService.createUser(userData);
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
      });
    }
    else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/v1/users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const result = await userService.updateUser(id, userData);
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
      });
    }
    else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/v1/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    if (result.success) {
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    }
    else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/v1/users/authenticate - Authenticate user
router.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticateUser(email, password);
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: "Authentication successful",
      });
    }
    else {
      res.status(401).json({
        success: false,
        error: result.error,
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
