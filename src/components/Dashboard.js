import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Shield, 
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats] = useState({
    totalDetections: 1247,
    activeAlerts: 3,
    systemStatus: 'Operational',
    accuracy: 97.3,
    avgResponseTime: 0.8,
    criticalObjects: 7
  });

  const [detectionData] = useState([
    { time: '00:00', detections: 45, alerts: 2 },
    { time: '04:00', detections: 32, alerts: 1 },
    { time: '08:00', detections: 67, alerts: 3 },
    { time: '12:00', detections: 89, alerts: 4 },
    { time: '16:00', detections: 76, alerts: 2 },
    { time: '20:00', detections: 54, alerts: 1 },
  ]);

  const [recentAlerts] = useState([
    { id: 1, type: 'Fire Extinguisher', status: 'Missing', location: 'Module A-7', time: '2 min ago' },
    { id: 2, type: 'Emergency Mask', status: 'Obstructed', location: 'Module B-3', time: '5 min ago' },
    { id: 3, type: 'Tool Kit', status: 'Misplaced', location: 'Module C-1', time: '12 min ago' },
  ]);

  const criticalObjects = [
    '🫁 Oxygen Tank',
    '🧪 Nitrogen Tank',
    '🩹 First Aid Box',
    '🚨 Fire Alarm',
    '⚡ Safety Switch Panel',
    '📞 Emergency Phone',
    '🧯 Fire Extinguisher'
  ];

  const StatCard = ({ icon: Icon, value, label, status = 'normal' }) => (
    <motion.div 
      className="stat-card"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="stat-icon" />
      <div className="stat-value" style={{ 
        color: status === 'danger' ? 'var(--accent-red)' : 
               status === 'warning' ? 'var(--accent-orange)' : 
               'var(--text-primary)' 
      }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );

  return (
    <div className="dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="dashboard-title">Orbital Guardian</h1>
        <p className="dashboard-subtitle">
          Advanced YOLO-powered safety monitoring system for space station critical equipment detection, 
          trained on high-quality synthetic data from Duality AI's Falcon digital twin
        </p>
      </motion.div>

      <div className="stats-grid">
        <StatCard 
          icon={Eye} 
          value={stats.totalDetections} 
          label="Total Detections Today" 
        />
        <StatCard 
          icon={AlertTriangle} 
          value={stats.activeAlerts} 
          label="Active Alerts" 
          status={stats.activeAlerts > 0 ? 'danger' : 'normal'}
        />
        <StatCard 
          icon={CheckCircle} 
          value={`${stats.accuracy}%`} 
          label="Detection Accuracy" 
        />
        <StatCard 
          icon={Zap} 
          value={`${stats.avgResponseTime}s`} 
          label="Avg Response Time" 
        />
      </div>

      <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <motion.div 
          className="stat-card" 
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-blue)' }}>
            <TrendingUp style={{ display: 'inline', marginRight: '0.5rem' }} />
            Detection Trends (24h)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={detectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="detections" 
                stroke="var(--accent-blue)" 
                strokeWidth={2}
                dot={{ fill: 'var(--accent-blue)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="var(--accent-red)" 
                strokeWidth={2}
                dot={{ fill: 'var(--accent-red)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div 
            className="stat-card" 
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-green)' }}>
              <Shield style={{ display: 'inline', marginRight: '0.5rem' }} />
              Critical Objects Monitored
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {criticalObjects.map((object, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '0.5rem', 
                    background: 'rgba(0, 255, 136, 0.1)', 
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  {object}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="stat-card" 
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>
              <Clock style={{ display: 'inline', marginRight: '0.5rem' }} />
              Recent Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  style={{ 
                    padding: '0.75rem', 
                    background: 'rgba(255, 71, 87, 0.1)', 
                    border: '1px solid var(--accent-red)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {alert.type}
                  </div>
                  <div style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>
                    {alert.status} • {alert.location}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;