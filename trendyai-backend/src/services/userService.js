import bcrypt from "bcryptjs";
import { supabase } from "./supabaseClient.js";

/**
 * User Service - Handles user operations with Supabase
 */

// Get all users
export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error)
      throw error;
    return { success: true, data };
  }
  catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("id", id)
      .single();

    if (error)
      throw error;
    return { success: true, data };
  }
  catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: error.message };
  }
}

// Create new user
export async function createUser(userData) {
  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password_hash: hashedPassword,
          role: userData.role || "user",
        },
      ])
      .select("id, name, email, role, created_at")
      .single();

    if (error)
      throw error;
    return { success: true, data };
  }
  catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
}

// Update user
export async function updateUser(id, userData) {
  try {
    // If password is being updated, hash it
    if (userData.password) {
      userData.password_hash = await bcrypt.hash(userData.password, 10);
      delete userData.password;
    }

    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select("id, name, email, role, created_at")
      .single();

    if (error)
      throw error;
    return { success: true, data };
  }
  catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }
}

// Delete user
export async function deleteUser(id) {
  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error)
      throw error;
    return { success: true, data };
  }
  catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
}

// Authenticate user
export async function authenticateUser(email, password) {
  try {
    // First, get the user with the email
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, name, email, password_hash, role")
      .eq("email", email)
      .single();

    if (fetchError)
      throw fetchError;
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return { success: false, error: "Invalid password" };
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return { success: true, data: userWithoutPassword };
  }
  catch (error) {
    console.error("Error authenticating user:", error);
    return { success: false, error: error.message };
  }
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser,
};
