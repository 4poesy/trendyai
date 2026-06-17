import { supabase } from './supabaseClient.js';

/**
 * Client Service - Handles client operations with Supabase
 */

// Get all clients
export const getClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { success: false, error: error.message };
  }
};

// Get client by ID
export const getClientById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching client:', error);
    return { success: false, error: error.message };
  }
};

// Create new client
export const createClient = async (clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error: error.message };
  }
};

// Update client
export const updateClient = async (id, clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error: error.message };
  }
};

// Delete client
export const deleteClient = async (id) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting client:', error);
    return { success: false, error: error.message };
  }
};

// Search clients
export const searchClients = async (query) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error searching clients:', error);
    return { success: false, error: error.message };
  }
};

export default {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients
};