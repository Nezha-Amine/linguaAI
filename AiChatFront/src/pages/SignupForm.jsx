import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './signup.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    level: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Network error or server not responding');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>LinguaAI - Register</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
        required
      />
      <select name="level" onChange={handleChange} required>
        <option value="">Select Level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>

      <p>
        Already have an account?{' '}
        <Link to="/login">Login here</Link> {/* Link to the login page */}
      </p>
    </form>
  );
};

export default SignupForm;
