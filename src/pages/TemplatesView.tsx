import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Clock, AlertTriangle, FileText, Globe, Tag, RefreshCw, Loader2 } from 'lucide-react';
import { Template } from '../types';
import { Modal } from '../components/Modal';
import api from '../services/api';

export const TemplatesView = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Marketing',
    language: 'en_US',
    body: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await api.post('/templates/sync');
      setTemplates(data.data);
    } catch (error) {
      console.error('Failed to sync templates', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Marketing', language: 'en_US', body: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (template: Template) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      category: template.category,
      language: template.language,
      body: template.body
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for local create/edit would go here, 
    // but typically for WhatsApp templates you create them on Meta and sync.
    // For MVP, we'll keep the UI but maybe disable saving or implement local creation later.
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-wa-green w-8 h-8" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Message Templates</h2>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync from Meta'}
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-wa-green text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={18} /> New Template
          </button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">Sync with Meta to import your existing WhatsApp templates.</p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="mt-6 px-4 py-2 text-wa-green font-medium hover:bg-green-50 rounded-lg transition-colors"
          >
            Sync Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{template.category} • {template.language}</span>
                </div>
                {template.status === 'approved' && <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><Check size={12} /> Approved</span>}
                {template.status === 'pending' && <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><Clock size={12} /> Pending</span>}
                {template.status === 'rejected' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full"><AlertTriangle size={12} /> Rejected</span>}
              </div>

              <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 font-mono leading-relaxed">{template.body || 'No text body'}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(template)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Keep user logic for creating templates if needed later, simplified for viewing */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "View Message Template" : "Create Message Template"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* Form content (omitted for brevity in this replace, can keep existing or simplify) */}
          <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            Templates should be created and edited in the Meta Business Manager. This form is for local preview/creation logic which is currently read-only for synced templates.
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};