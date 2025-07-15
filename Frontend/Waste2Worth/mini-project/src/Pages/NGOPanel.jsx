import React, { useState, useEffect } from 'react';
import './ngopanel.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";

// Sidebar component
const Sidebar = ({ onSelectTab }) => (
  <div className="sidebar">
    <h2>NGO Dashboard</h2>
    <ul>
      <li onClick={() => onSelectTab('overview')}>Overview</li>
      <li onClick={() => onSelectTab('freshFood')}>Fresh Food Requests</li>
      <li onClick={() => onSelectTab('rottenFood')}>Rotten Food Requests</li>
      <li onClick={() => onSelectTab('donations')}>Donations</li>
      <li onClick={() => onSelectTab('fertilizerBooking')}>Fertilizer Booking</li>
    </ul>
  </div>
);

// Topbar component
const Topbar = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <h3>Food Waste Management - NGO</h3>
      <div className="user-info">
        <span>{username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

// Donation Requests Component
const DonationRequests = ({ donations, onAccept, onReject }) => (
  <div className="requests">
    {donations.map((donation) => (
      <div key={donation.id} className="donation-card">
        <p><strong>Donor:</strong> {donation.name}</p>
        <p><strong>Quantity:</strong> {donation.quantity} Kg</p>
        <p><strong>Location:</strong> {donation.address}</p>
        <p><strong>Food Type:</strong> {donation.foodType}</p>
        <img
          src={donation.imageUrl}
          alt="Food"
          width="200"
          onError={() => console.error("Image failed to load:", donation.imageUrl)}
        />
        {donation.latitude && donation.longitude && (
          <p>
            <a
              href={`https://www.google.com/maps?q=${donation.latitude},${donation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Location on Map
            </a>
          </p>
        )}
        <button onClick={() => onAccept(donation)}>Accept</button>
        <button onClick={() => onReject(donation)}>Reject</button>
      </div>
    ))}
  </div>
);

// Donations Table Component
const DonationsTable = ({ donations, exportToPDF, exportToExcel, exportToWord }) => (
  <div className="donations-table-container">
    <div className="export-buttons">
      <button onClick={exportToPDF}>📄 Export PDF</button>
      <button onClick={exportToExcel}>📊 Export Excel</button>
      <button onClick={exportToWord}>📃 Export Word</button>
    </div>
    <table className="donations-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Donor</th>
          <th>Quantity (Kg)</th>
          <th>Location</th>
          <th>Food Type</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {donations.map(d => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.name}</td>
            <td>{d.quantity}</td>
            <td>{d.address}</td>
            <td>{d.foodType}</td>
            <td>{d.status}</td>
            <td>{d.donationDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Fertilizer Bookings Table Component
const FertilizerBookingsTable = ({ bookings }) => {
  return (
    <div className="table-container">
      <table className="fertilizer-bookings-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="5">No bookings available.</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customerName || 'N/A'}</td>
                <td>{booking.productName || 'N/A'}</td>
                <td>{booking.quantity || '0'}</td>
                <td>{booking.totalPrice || '0'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Main NGOPanel Component
function NGOPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [fertilizerBookings, setFertilizerBookings] = useState([]);

  const fetchDonations = () => {
    fetch('http://localhost:8080/api/ngo/donations/pending')
      .then(response => response.json())
      .then(data => setDonations(data))
      .catch(error => alert("Error fetching donation data: " + error.message));
  };

  const fetchFertilizerBookings = () => {
    fetch('http://localhost:8080/api/ngo/fertilizer-bookings')
      .then(response => response.json())
      .then(data => setFertilizerBookings(data))
      .catch(error => alert("Error fetching fertilizer bookings: " + error.message));
  };

  const fetchAcceptedDonations = () => {
    fetch('http://localhost:8080/api/ngo/donations/accepted')
      .then(response => response.json())
      .then(data => setAcceptedDonations(data))
      .catch(error => alert("Error fetching accepted donations: " + error.message));
  };

  const handleAccept = (donation) => {
    fetch(`http://localhost:8080/api/ngo/donations/accept/${donation.id}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          alert(`Accepted! Email sent to ${donation.customerEmail}`);
          fetchDonations();
        } else {
          alert("Failed to accept the donation.");
        }
      })
      .catch(() => alert("Error occurred while accepting donation."));
  };

  const handleReject = (donation) => {
    fetch(`http://localhost:8080/api/ngo/donations/reject/${donation.id}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          alert(`Rejected! Email sent to ${donation.customerEmail}`);
          fetchDonations();
        } else {
          alert("Failed to reject the donation.");
        }
      })
      .catch(() => alert("Error occurred while rejecting donation."));
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const header = ['ID', 'Donor', 'Quantity (Kg)', 'Location', 'Food Type', 'Status', 'Date'];
    const data = acceptedDonations.map(d => [
      d.id, d.name, `${d.quantity} kg`, d.address, d.foodType, d.status, d.donationDate
    ]);
    doc.autoTable({ head: [header], body: data });
    doc.save('donation-history.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(acceptedDonations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'donations_report.xlsx');
  };

  const exportToWord = () => {
    const tableRows = acceptedDonations.map(d => [
      d.id?.toString() || '',
      d.name || '',
      `${d.quantity} Kg`,
      d.address || '',
      d.foodType || '',
      d.status || '',
      d.donationDate || ''
    ]);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'NGO Donation Report', bold: true, size: 28 })],
            spacing: { after: 300 },
          }),
          new Table({
            rows: [
              new TableRow({
                children: ['ID', 'Donor', 'Quantity', 'Location', 'Food Type', 'Status', 'Date']
                  .map(header => new TableCell({ children: [new Paragraph({ text: header, bold: true })] })),
              }),
              ...tableRows.map(row => new TableRow({
                children: row.map(cell => new TableCell({ children: [new Paragraph(cell)] }))
              }))
            ]
          })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'donation-report.docx');
    });
  };

  useEffect(() => {
    fetchDonations();
    fetchFertilizerBookings();
  }, []);

  useEffect(() => {
    if (activeTab === 'donations') {
      fetchAcceptedDonations();
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'donations':
        return (
          <DonationsTable
            donations={acceptedDonations}
            exportToPDF={exportToPDF}
            exportToExcel={exportToExcel}
            exportToWord={exportToWord}
          />
        );
      case 'freshFood':
        return (
          <DonationRequests
            donations={donations.filter(d => d.foodType !== 'Rotten')}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case 'rottenFood':
        return (
          <DonationRequests
            donations={donations.filter(d => d.foodType === 'Rotten')}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case 'fertilizerBooking':
        return <FertilizerBookingsTable bookings={fertilizerBookings} />;
      default:
        return <p style={{ padding: "20px" }}>Welcome to the NGO Panel! Select a tab to get started.</p>;
    }
  };

  return (
    <div className="ngopanel">
      <Sidebar onSelectTab={setActiveTab} />
      <div className="main-content">
        <Topbar />
        {renderTab()}
      </div>
    </div>
  );
}

export default NGOPanel;
