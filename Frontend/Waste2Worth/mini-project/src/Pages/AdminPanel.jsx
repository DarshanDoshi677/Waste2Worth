import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';
import {
  BarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const Sidebar = ({ onSelectTab }) => (
  <div className="sidebar">
    <h2>Admin Panel</h2>
    <ul>
      <li onClick={() => onSelectTab('dashboard')}>Dashboard</li>
      <li onClick={() => onSelectTab('users')}>User Management</li>
      <li onClick={() => onSelectTab('acceptance')}>User Approvals</li>
      <li onClick={() => onSelectTab('reports')}>Reports</li>
    </ul>
  </div>
);

const Topbar = ({ username, onLogout }) => (
  <div className="topbar">
    <h3>Food Waste Management</h3>
    <div className="user-info">
      <span>{username}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  </div>
);

const Dashboard = ({ stats }) => (
  <div className="dashboard">
    <h2>Dashboard</h2>
    <div className="stats">
      <div className="stat-card">
        <h3>Total Waste</h3>
        <p>{stats.totalWaste} Kg</p>
      </div>
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>{stats.totalUsers}</p>
      </div>
      <div className="stat-card">
        <h3>Waste Collected Today</h3>
        <p>{stats.wasteCollectedToday} Kg</p>
      </div>
    </div>
  </div>
);

const UserManagement = ({ users, onDelete }) => (
  <div className="users">
    <h2>User Management</h2>
    <p>List of registered users and their roles.</p>
    <table className="user-table">
      <thead>
        <tr>
          <th style={{ backgroundColor: '#4CAF50', color: 'white' }}>Name</th>
          <th style={{ backgroundColor: '#4CAF50', color: 'white' }}>Email</th>
          <th style={{ backgroundColor: '#4CAF50', color: 'white' }}>Role</th>
          <th style={{ backgroundColor: '#4CAF50', color: 'white' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => window.confirm('Delete user?') && onDelete(user.email)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserApprovals = ({ pendingUsers, onApprove, onReject }) => (
  <div className="acceptance">
    <h2>User Approvals</h2>
    <p>Review pending NGO registrations below:</p>
    <div className="pending-users-list">
      {pendingUsers.length === 0 ? (
        <p>No pending NGO users for approval.</p>
      ) : (
        pendingUsers.map((user) => (
          <div className="pending-users" key={user.email}>
            <p><strong>{user.name}</strong> ({user.email}) - {user.role}</p>
            <button className="accept" onClick={() => onApprove(user.email)}>Approve</button>
            <button className="reject" onClick={() => onReject(user.email)}>Reject</button>
          </div>
        ))
      )}
    </div>
  </div>
);

const Reports = () => {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/admin/report/pie')
      .then((res) => Array.isArray(res.data) ? setPieData(res.data) : setError('Invalid pie chart data format.'))
      .catch(() => setError('Failed to fetch pie chart data.'));

    axios.get('http://localhost:8080/admin/report/bar')
      .then((res) => Array.isArray(res.data) ? setBarData(res.data) : setError('Invalid bar chart data format.'))
      .catch(() => setError('Failed to fetch bar chart data.'));
  }, []);

  const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

  if (error) return <div className="reports"><h2>Reports</h2><p>{error}</p></div>;

  return (
    <div className="reports">
      <h2>Reports</h2>
      <div className="chart-container" style={{ width: '100%', height: '400px' }}>
        <h3>Waste Distribution (Pie Chart)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <RechartsPie data={pieData} dataKey="count" nameKey="foodType" innerRadius={100} outerRadius={150} paddingAngle={5} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RechartsPie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>

        <h3>Waste Collected Over Time (Bar Chart)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData.filter(b => b.status)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <RechartsBar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({ totalWaste: 0, totalUsers: 0, wasteCollectedToday: 0 });
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
      fetchDashboardStats();
      fetchUsers();
      fetchPendingUsers();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchDashboardStats = () => {
    axios.get('http://localhost:8080/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error fetching dashboard stats:', err));
  };

  const fetchUsers = () => {
    axios.get('http://localhost:8080/admin/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));
  };

  const fetchPendingUsers = () => {
    axios.get('http://localhost:8080/admin/users/pending')
      .then((res) => {
        const ngoUsers = res.data.filter(user => user.role.toLowerCase() === 'ngo' && user.status === 'PENDING');
        setPendingUsers(ngoUsers);
      })
      .catch((err) => console.error('Error fetching pending users:', err));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDeleteUser = (email) => {
    axios.delete(`http://localhost:8080/admin/users/${email}`)
      .then(() => {
        alert('User deleted successfully');
        fetchUsers();
      })
      .catch(() => alert('Error deleting user.'));
  };

  const handleApprove = (email) => {
    axios.post('http://localhost:8080/admin/approve', { email })
      .then((res) => {
        alert(res.data);
        fetchPendingUsers();
      })
      .catch(() => alert('Error approving user.'));
  };

  const handleReject = (email) => {
    axios.post('http://localhost:8080/admin/reject', { email })
      .then((res) => {
        alert(res.data);
        fetchPendingUsers();
      })
      .catch(() => alert('Error rejecting user.'));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'users': return <UserManagement users={users} onDelete={handleDeleteUser} />;
      case 'acceptance': return <UserApprovals pendingUsers={pendingUsers} onApprove={handleApprove} onReject={handleReject} />;
      case 'reports': return <Reports />;
      default: return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar onSelectTab={setActiveTab} />
      <div className="main-content">
        <Topbar username={username} onLogout={handleLogout} />
        {renderTab()}
      </div>
    </div>
  );
}

export default AdminPanel;