import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";

const Sidebar = ({ onSelectTab }) => (
  <div className="sidebar">
    <div className="sidebar-header">
      <h2>Food Donation</h2>
    </div>
    <div className="sidebar-buttons">
      <button onClick={() => onSelectTab('dashboard')}>Dashboard</button>
      <button onClick={() => onSelectTab('profile')}>Profile</button>
      <button onClick={() => onSelectTab('history')}>Donation History</button>
    </div>
  </div>
);

const Topbar = ({ name, onLogout }) => (
  <div className="topbar">
    <h3>Welcome, {name}</h3>
    <button className="logout-btn" onClick={onLogout}>Logout</button>
  </div>
);

const DonateHistory = ({ email }) => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/donations/history/${email}`);
        if (Array.isArray(res.data)) {
          setDonations(res.data);
        } else {
          setError("Invalid data format received.");
        }
      } catch (err) {
        setError("Failed to fetch donation history. Please try again later.");
      }
    };
    fetchHistory();
  }, [email]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text('Donation History', 20, 10);
  
    // Table Header
    const header = ['Food Type', 'Quantity (Kg)', 'Address', 'Food Details'];
    const data = donations.map(d => [d.foodType, `${d.quantity} kg`, d.address, d.foodDetails]);
    
    // Set header styles
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // White text for the header
    doc.setFillColor(41, 128, 185); // Blue background for the header
    
    // Create the header row
    doc.rect(20, 20, 180, 10, 'F'); // Table header background
    header.forEach((text, index) => {
      doc.text(text, 20 + index * 45, 25);
    });
    
    // Table Data
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60); // Light gray color for text
    let y = 30;
    data.forEach((row, rowIndex) => {
      const fillColor = rowIndex % 2 === 0 ? [230, 230, 255] : [255, 255, 255]; // Alternating row colors
      doc.setFillColor(...fillColor); 
      doc.rect(20, y, 180, 10, 'F');
      
      row.forEach((text, index) => {
        doc.text(text, 20 + index * 45, y + 7);
      });
      y += 10;
    });
  
    // Thank you note
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(34, 139, 34); // Green color for the thank-you note
    doc.text('Thank you for your generous donations!', 20, y + 10);
  
    doc.save('donation-history.pdf');
  };
  
  
  const exportToExcel = () => {
    const data = donations.map(d => ({
      'Food Type': d.foodType,
      'Quantity (Kg)': d.quantity,
      'Address': d.address,
      'Food Details': d.foodDetails,
    }));
  
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Adding a header row and applying styling
    const header = ws['A1'].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2980b9' } },
      alignment: { horizontal: 'center' },
    };
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Donation History');
    
    // Saving the file with styled content
    XLSX.writeFile(wb, 'donation-history.xlsx');
  };
  
  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        children: [
          // Title
          new Paragraph({
            children: [new TextRun({ text: "Donation History", bold: true, size: 28, color: "#1e90ff" })], // Blue color for title
            alignment: 'center',
          }),
          
          // Table
          new Table({
            rows: [
              // Table Header
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Food Type", bold: true, color: "#FFFFFF" })],
                    })],
                    shading: { fill: "#2980b9" }, // Blue background
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Quantity (Kg)", bold: true, color: "#FFFFFF" })],
                    })],
                    shading: { fill: "#2980b9" }, // Blue background
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Address", bold: true, color: "#FFFFFF" })],
                    })],
                    shading: { fill: "#2980b9" }, // Blue background
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Food Details", bold: true, color: "#FFFFFF" })],
                    })],
                    shading: { fill: "#2980b9" }, // Blue background
                  }),
                ],
              }),
  
              // Table Data
              ...donations.map((d, index) => new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: `${d.foodType}`, color: "#000000" })],
                    })],
                    shading: { fill: index % 2 === 0 ? "#f0f8ff" : "#ffffff" }, // Alternating row colors
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: `${d.quantity} kg`, color: "#000000" })],
                    })],
                    shading: { fill: index % 2 === 0 ? "#f0f8ff" : "#ffffff" }, // Alternating row colors
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: `${d.address}`, color: "#000000" })],
                    })],
                    shading: { fill: index % 2 === 0 ? "#f0f8ff" : "#ffffff" }, // Alternating row colors
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: `${d.foodDetails}`, color: "#000000" })],
                    })],
                    shading: { fill: index % 2 === 0 ? "#f0f8ff" : "#ffffff" }, // Alternating row colors
                  }),
                ],
              })),
  
              // Thank you note
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Thank you for your generous donations!", bold: true, size: 24, color: "#228b22" })],
                      alignment: 'center',
                    })],
                    colSpan: 4,
                    shading: { fill: "#ffffff" },
                  }),
                ],
              }),
            ],
          }),
        ],
      }],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'donation-history.docx');
  };
  
  
  
  const handlePrint = () => {
    const printContent = document.getElementById('donationHistory');
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="donate-history-page">
      <h2>Donation History</h2>
      {error && <p className="error">{error}</p>}
      <div id="donationHistory" className="donation-table">
        <table>
          <thead>
            <tr>
              <th>Food Type</th>
              <th>Quantity (Kg)</th>
              <th>Address</th>
              <th>Food Details</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((d, i) => (
                <tr key={i}>
                  <td>{d.foodType}</td>
                  <td>{d.quantity}</td>
                  <td>{d.address}</td>
                  <td>{d.foodDetails}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No donation history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="export-buttons">
        <button className="btn-export" onClick={exportToPDF}>Export to PDF</button>
        <button className="btn-export" onClick={exportToExcel}>Export to Excel</button>
        <button className="btn-export" onClick={exportToWord}>Export to Word</button>
        <button className="btn-export" onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
};

const Profile = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSave = async () => {
    const updatedProfile = { 
      name: formData.name, 
      email: formData.email, 
      password: password ? password : undefined, // Only send password if not empty
    };
  
    const email = localStorage.getItem("username");
  
    try {
      const response = await axios.put(`http://localhost:8080/api/auth/profile/update`, updatedProfile);
      onProfileUpdate(response.data); 
      setIsEditing(false); 
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {isEditing ? (
        <div className="edit-form">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly />
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
        </div>
      ) : (
        <div className="profile-info">
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <button onClick={() => setIsEditing(true)} className="btn-edit">Edit Profile</button>
        </div>
      )}
    </div>
  );
};

function UserPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState({});
  const email = localStorage.getItem("username");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/auth/profile/${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };
    fetchProfile();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = '/login'; 
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <h2>Welcome to Your Dashboard</h2>
            <p>Here is your dashboard content...</p>
          </div>
        );
      case 'profile':
        return <Profile profile={profile} onProfileUpdate={setProfile} />;
      case 'history':
        return <DonateHistory email={email} />;
      default:
        return null;
    }
  };

  return (
    <div className="user-panel">
      <Sidebar onSelectTab={setActiveTab} />
      <div className="main-content">
        <Topbar name={profile.name || "User"} onLogout={handleLogout} />
        {renderTab()}
      </div>

      <style jsx>{`
        .user-panel {
          display: flex;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 250px;
          background-color: #34495e;
          color: white;
          padding: 20px;
        }

        .sidebar-header h2 {
          font-size: 1.8em;
          text-align: center;
          color: #f39c12;
        }

        .sidebar-buttons button {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: none;
          background-color: #2980b9;
          color: white;
          font-size: 1.2em;
          cursor: pointer;
        }

        .sidebar-buttons button:hover {
          background-color: #3498db;
        }

        .main-content {
          flex-grow: 1;
          padding: 20px;
          background-color: #ecf0f1;
        }

        .topbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #2c3e50;
          color: white;
          font-size: 1.5em;
        }

        .logout-btn {
          padding: 10px;
          background-color: #e74c3c;
          color: white;
          border: none;
          cursor: pointer;
        }

        .logout-btn:hover {
          background-color: #c0392b;
        }

        .donate-history-page h2 {
          font-size: 1.8em;
          color: #34495e;
          margin-bottom: 20px;
        }

        .donation-table {
          margin-top: 20px;
          font-size: 1.1em;
        }

        .donation-table table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ccc;
        }

        .donation-table th, .donation-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .donation-table th {
          background-color: #2c3e50;
          color: white;
        }

        .export-buttons button {
          margin-right: 10px;
          padding: 10px;
          background-color: #27ae60;
          color: white;
          border: none;
          cursor: pointer;
        }

        .export-buttons button:hover {
          background-color: #2ecc71;
        }

        .profile-page {
          max-width: 600px;
          margin: 0 auto;
        }

        .edit-form input {
          padding: 10px;
          width: 100%;
          margin-bottom: 10px;
        }

        .btn-save,
        .btn-cancel {
          padding: 10px;
          cursor: pointer;
          font-size: 1.1em;
        }

        .btn-save {
          background-color: #27ae60;
          color: white;
          border: none;
        }

        .btn-save:hover {
          background-color: #2ecc71;
        }

        .btn-cancel {
          background-color: #e74c3c;
          color: white;
          border: none;
        }

        .btn-cancel:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
}

export default UserPanel;
