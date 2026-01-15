import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Image as ImageIcon, Send, Edit2, Trash2, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Campaign } from '../types';
import { PhonePreview } from '../components/PhonePreview';
import { Modal } from '../components/Modal';

// Helper Component for Status Badges
const StatusBadge = ({ status }: { status: Campaign['status'] }) => {
  const config = {
    Sent: {
      style: 'bg-green-100 text-green-700 border-green-200',
      icon: CheckCircle2
    },
    Scheduled: {
      style: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Clock
    },
    Draft: {
      style: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: FileText
    }
  };

  const { style, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};

export const CampaignsView = () => {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [newMessage, setNewMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    message: string;
    image: string | null;
    status: Campaign['status'];
  }>({ name: '', message: '', image: null, status: 'Draft' });

  // Mock Data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'Summer Promo 2024', status: 'Sent', sent: 1250, total: 1250, date: 'Oct 24, 2024', message: 'Hey there! Our Summer Sale is live. Get 50% off now!', image: null },
    { id: '2', name: 'Product Launch: Alpha', status: 'Scheduled', sent: 0, total: 5000, date: 'Nov 01, 2024', message: 'Introducing Alpha. The future of tech.', image: null },
    { id: '3', name: 'Inactive User Re-engagement', status: 'Draft', sent: 0, total: 320, date: 'Oct 28, 2024', message: 'We miss you! Come back for a special treat.', image: null },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditFormData(prev => ({ ...prev, image: reader.result as string }));
        } else {
          setImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditFormData({
      name: campaign.name,
      message: campaign.message || '',
      image: campaign.image || null,
      status: campaign.status
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    setCampaigns(campaigns.map(c =>
      c.id === editingCampaign.id
        ? {
          ...c,
          name: editFormData.name,
          message: editFormData.message,
          image: editFormData.image,
          status: editFormData.status
        }
        : c
    ));
    setIsEditModalOpen(false);
    setEditingCampaign(null);
  };

  if (viewMode === 'create') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-[calc(100vh-140px)]"
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setViewMode('list')}
            className="text-gray-500 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            ← Back to Campaigns
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Save Draft</button>
            <button className="px-6 py-2 bg-wa-green text-white rounded-lg hover:bg-green-600 font-medium shadow-lg shadow-green-500/30 flex items-center gap-2">
              <Send size={18} /> Schedule Campaign
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Editor */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Compose Message</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input type="text" placeholder="e.g. Winter Sale Announcement" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Header (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-wa-green transition-colors cursor-pointer relative group">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-wa-green">
                    <ImageIcon size={32} />
                    <span className="text-sm font-medium">Click to upload image</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all min-h-40 resize-none"
                    placeholder="Hello {{1}}, check out our latest offers..."
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 font-medium">Add Variable</button>
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 font-medium">Add Emoji</button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">{newMessage.length} characters</p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Live Preview</h3>
            <PhonePreview message={newMessage} image={imagePreview} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search campaigns..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wa-green w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>
        <button
          onClick={() => setViewMode('create')}
          className="bg-wa-green hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus size={20} /> New Campaign
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Campaign Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Sent / Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{campaign.name}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-wa-green h-full rounded-full"
                        style={{ width: `${(campaign.sent / campaign.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{campaign.sent}/{campaign.total}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{campaign.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(campaign)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Campaign">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Campaign">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Campaign Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Campaign"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Draft', 'Scheduled', 'Sent'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, status })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${editFormData.status === status
                        ? status === 'Sent' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500'
                          : status === 'Scheduled' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                            : 'bg-slate-50 border-slate-500 text-slate-700 ring-1 ring-slate-500'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {status === 'Sent' && <CheckCircle2 size={16} />}
                    {status === 'Scheduled' && <Clock size={16} />}
                    {status === 'Draft' && <FileText size={16} />}
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Header (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-wa-green transition-colors cursor-pointer relative group bg-gray-50">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-wa-green">
                  {editFormData.image ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img src={editFormData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium text-sm">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={24} />
                      <span className="text-sm font-medium">Click to upload new image</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
              <textarea
                value={editFormData.message}
                onChange={e => setEditFormData({ ...editFormData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all min-h-32"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-wa-green text-white hover:bg-green-600 font-medium shadow-lg shadow-green-500/20 transition-all transform active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};