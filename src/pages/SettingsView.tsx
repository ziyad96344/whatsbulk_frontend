import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Key, Globe, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export const SettingsView = () => {
  const [metaConfig, setMetaConfig] = useState({
    phone_id: '',
    waba_id: '',
    access_token: ''
  });
  const [status, setStatus] = useState<string>('Checking...');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get('/settings/meta');
      if (data.status === 'Configured') {
        setStatus('Configured');
        setMetaConfig(prev => ({
          ...prev,
          phone_id: data.phone_id,
          waba_id: data.waba_id,
        }));
      } else {
        setStatus('Not Configured');
      }
    } catch (error) {
      setStatus('Error checking status');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/settings/meta', metaConfig);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
      setStatus('Configured');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/settings/meta/test');
      setMessage({ type: 'success', text: 'Connection successful!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Connection failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">

      {/* API Configuration */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">WhatsApp API Configuration</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">Manage your connection to the Meta Cloud API.</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'Configured' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {message && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number ID</label>
              <input
                type="text"
                value={metaConfig.phone_id}
                onChange={(e) => setMetaConfig({ ...metaConfig, phone_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none bg-white font-mono text-sm"
                placeholder="Enter Phone Number ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Business Account ID</label>
              <input
                type="text"
                value={metaConfig.waba_id}
                onChange={(e) => setMetaConfig({ ...metaConfig, waba_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none bg-white font-mono text-sm"
                placeholder="Enter WABA ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permanent Access Token</label>
            <div className="relative">
              <input
                type="password"
                value={metaConfig.access_token}
                onChange={(e) => setMetaConfig({ ...metaConfig, access_token: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white font-mono text-sm text-gray-700"
                placeholder="EAAG..."
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Shield size={12} /> Your token is encrypted and stored securely.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleTest}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              Test Connection
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-wa-dark text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Business Profile</h3>
            <p className="text-sm text-gray-500">This information will be visible to your contacts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
            <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none min-h-[100px]" defaultValue="We are a leading provider of premium software solutions..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input type="text" defaultValue="123 Innovation Dr, Tech City" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" defaultValue="support@company.com" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">https://</span>
              <input type="text" defaultValue="www.company.com" className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none" />
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};