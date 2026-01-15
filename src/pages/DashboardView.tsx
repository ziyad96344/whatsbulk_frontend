import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Send, CheckCircle, Eye, AlertCircle, ArrowUp, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const initialData = [
  { name: 'Mon', messages: 4000 },
  { name: 'Tue', messages: 3000 },
  { name: 'Wed', messages: 5000 },
  { name: 'Thu', messages: 2780 },
  { name: 'Fri', messages: 6890 },
  { name: 'Sat', messages: 8390 },
  { name: 'Sun', messages: 9490 },
];

const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend > 0 ? '+' : ''}{trend}%
        <ArrowUp className={`w-3 h-3 ml-1 ${trend < 0 ? 'rotate-180' : ''}`} />
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    <p className="text-xs text-gray-400 mt-2">{sub}</p>
  </motion.div>
);

export const DashboardView = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt fetch
        const { data } = await api.get('/dashboard/metrics');
        setMetrics(data.metrics);
        if (data.chartData) setChartData(data.chartData);
      } catch (e) {
        console.log("Using mock data for dashboard");
        // Mock Fallback
        setMetrics({
          total_sent: "24,500",
          delivered_rate: "98.2%",
          read_rate: "85.4%",
          failed_rate: "1.2%"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-wa-green w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sent" value={metrics?.total_sent || "0"} sub="Last 7 days" icon={Send} color="bg-blue-500" trend={12.5} />
        <StatCard title="Delivered" value={metrics?.delivered_rate || "0%"} sub="Delivery Rate" icon={CheckCircle} color="bg-wa-green" trend={2.1} />
        <StatCard title="Read Rate" value={metrics?.read_rate || "0%"} sub="Engagement" icon={Eye} color="bg-purple-500" trend={5.4} />
        <StatCard title="Failed" value={metrics?.failed_rate || "0%"} sub="Bounce Rate" icon={AlertCircle} color="bg-red-500" trend={-0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Message Volume</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-wa-green focus:border-wa-green">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="messages" stroke="#25D366" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Campaigns</h3>
          <div className="space-y-4">
            {[
              { name: "Black Friday Sale", status: "Completed", time: "2 hours ago", color: "text-green-600 bg-green-50" },
              { name: "New User Welcome", status: "Sending...", time: "5 mins ago", color: "text-blue-600 bg-blue-50" },
              { name: "Abandoned Cart", status: "Scheduled", time: "Tomorrow, 9AM", color: "text-amber-600 bg-amber-50" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-wa-green font-semibold flex items-center justify-center gap-2 hover:bg-green-50 rounded-lg transition-colors">
            View All Activity <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};