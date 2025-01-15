import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MenuBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the logout function passed as a prop
    onLogout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div style={menuBarStyle}>
      <Link style={linkStyle} to="/chat">Chat Bot</Link>
      <Link style={linkStyle} to="/quizz">Quiz</Link>
      <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
    </div>
  );
};

const menuBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#663591',
  color: '#fff',
  padding: '10px 20px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  margin: '0 20px',
  fontSize: '1.2rem',
};

const logoutButtonStyle = {
  backgroundColor: '#FD6A04',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default MenuBar;
