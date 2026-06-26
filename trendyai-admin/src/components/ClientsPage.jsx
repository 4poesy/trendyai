import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import ClientDetailsModal from './ClientDetailsModal';
import { useToast } from './Toast';
import environment from '../config/environment';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { showSuccess, showError } = useToast();

  // Load clients from backend API or localStorage fallback
  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch(`${environment.backend.baseURL}/clients`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mappedClients = resData.data.map(c => ({
            id: c.id,
            name: c.name || c.company || 'Unnamed Client',
            email: c.email || '',
            phone: c.phone || '',
            status: c.status || 'active',
            projects: c.projects || 0,
            briefing: c.metadata?.briefing || '',
            address: c.metadata?.address || ''
          }));
          setClients(mappedClients);
          setFilteredClients(mappedClients);
          setError(null);
        } else {
          throw new Error(resData.error || 'Invalid API response');
        }
      } catch (err) {
        console.warn('Failed to load from backend API, falling back to mock data:', err);
        const stored = localStorage.getItem('trendyai_mock_clients');
        let mockClients = [];
        if (stored) {
          mockClients = JSON.parse(stored);
        } else {
          mockClients = [
            {
              id: 1,
              name: 'Acme Corporation',
              email: 'contact@acme.com',
              phone: '+1 (555) 123-4567',
              address: '123 Business Ave, New York, NY 10001',
              status: 'active',
              createdAt: '2023-01-15',
              projects: 3,
              briefing: 'Optimize SaaS landing page SEO metrics.'
            },
            {
              id: 2,
              name: 'Globex Inc.',
              email: 'info@globex.com',
              phone: '+1 (555) 987-6543',
              address: '456 Enterprise Blvd, Los Angeles, CA 90001',
              status: 'active',
              createdAt: '2023-02-20',
              projects: 1,
              briefing: 'Set up automated outreach campaign.'
            },
            {
              id: 3,
              name: 'Initech LLC',
              email: 'support@initech.com',
              phone: '+1 (555) 456-7890',
              address: '789 Startup St, San Francisco, CA 94102',
              status: 'inactive',
              createdAt: '2023-03-10',
              projects: 0,
              briefing: 'Legacy database migration and cleanup.'
            }
          ];
          localStorage.setItem('trendyai_mock_clients', JSON.stringify(mockClients));
        }
        setClients(mockClients);
        setFilteredClients(mockClients);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [showError]);

  useEffect(() => {
    let result = clients;
    
    if (searchTerm) {
      result = result.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(client => client.status === filterStatus);
    }
    
    setFilteredClients(result);
  }, [searchTerm, filterStatus, clients]);

  const handleAddClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const isMock = typeof clientId === 'number' || !isNaN(Number(clientId));
      
      if (!isMock) {
        const response = await fetch(`${environment.backend.baseURL}/clients/${clientId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Failed to delete from backend API: ${response.status}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to delete client');
        }
      }
      
      setClients(prev => {
        const updated = prev.filter(client => client.id !== clientId);
        localStorage.setItem('trendyai_mock_clients', JSON.stringify(updated));
        return updated;
      });
      showSuccess('Client deleted successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      showError('Failed to delete client');
    }
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (clientData) => {
    try {
      let savedClient = null;
      const isEdit = !!editingClient;
      
      try {
        const url = isEdit 
          ? `${environment.backend.baseURL}/clients/${editingClient.id}` 
          : `${environment.backend.baseURL}/clients`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const payload = {
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.name,
          status: clientData.status || 'active',
          metadata: {
            briefing: clientData.briefing || '',
            address: clientData.address || ''
          }
        };
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && resJson.data) {
            const c = resJson.data;
            savedClient = {
              id: c.id,
              name: c.name || c.company || 'Unnamed Client',
              email: c.email || '',
              phone: c.phone || '',
              status: c.status || 'active',
              projects: c.projects || 0,
              briefing: c.metadata?.briefing || '',
              address: c.metadata?.address || ''
            };
          }
        }
      } catch (apiErr) {
        console.warn('API save failed, using local/mock storage fallback:', apiErr);
      }
      
      if (isEdit) {
        setClients(prev => {
          const updated = prev.map(client => {
            if (client.id === editingClient.id) {
              return savedClient || { ...client, ...clientData, updatedAt: new Date().toISOString() };
            }
            return client;
          });
          localStorage.setItem('trendyai_mock_clients', JSON.stringify(updated));
          return updated;
        });
        showSuccess('Client updated successfully');
      } else {
        const newClient = savedClient || {
          ...clientData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          status: 'active',
          projects: 0
        };
        setClients(prev => {
          const updated = [...prev, newClient];
          localStorage.setItem('trendyai_mock_clients', JSON.stringify(updated));
          return updated;
        });
        showSuccess('Client added successfully');
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error occurred:', error);
      showError(editingClient ? 'Failed to update client' : 'Failed to add client');
    }
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Client Accounts</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Manage client credentials, onboarding briefings, and project assignments.</p>
        </div>
        <button
          onClick={handleAddClient}
          className="crm-btn crm-btn-primary"
        >
          <FaPlus /> Add Client Account
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="crm-input pl-10"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <FaFilter />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="crm-input pl-10 pr-8 appearance-none bg-bg-card"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Client List */}
      <ClientList
        clients={filteredClients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onView={handleViewClient}
        search={searchTerm}
        setSearch={setSearchTerm}
      />

      {/* Client Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border-main rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-text-main mb-6">
                {editingClient ? 'Edit Client Account' : 'Add New Client Account'}
              </h2>
              <ClientForm
                initial={editingClient}
                onSave={handleSaveClient}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={handleCloseDetails}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}
    </div>
  );
};

export default ClientsPage;
