import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, CheckCircle, XCircle, User, Phone, Tag } from 'lucide-react';
import { Contact } from '../types';
import { Modal } from '../components/Modal';

const initialContacts: Contact[] = [
  { id: '1', name: 'John Doe', phone: '+1 234 567 8900', tags: ['VIP', 'Customer'], status: 'valid' },
  { id: '2', name: 'Jane Smith', phone: '+1 987 654 3210', tags: ['Lead'], status: 'valid' },
  { id: '3', name: 'Bob Johnson', phone: '+44 7700 900077', tags: ['Inactive'], status: 'invalid' },
  { id: '4', name: 'Alice Williams', phone: '+1 555 123 4567', tags: ['Customer', '2024'], status: 'valid' },
];

export const ContactsView = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', tags: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'valid',
    };

    setContacts([newContact, ...contacts]);
    setFormData({ name: '', phone: '', tags: '' });
    setIsModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Contacts</h2>
           <p className="text-sm text-gray-500">Manage your audience list</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-wa-green bg-green-50 border border-transparent rounded-lg hover:bg-green-100 font-medium flex items-center gap-2 transition-colors">
            <Upload size={18} /> Import CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-wa-green text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={18} /> Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
             <tr>
               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Phone Number</th>
               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tags</th>
               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{contact.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {contact.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {contact.status === 'valid' ? (
                    <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                      <CheckCircle size={16} /> Valid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                      <XCircle size={16} /> Invalid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Contact"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. +1 234 567 890"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="VIP, Summer2024, Lead"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-wa-green text-white hover:bg-green-600 font-medium shadow-lg shadow-green-500/20 transition-all transform active:scale-95"
            >
              Save Contact
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};