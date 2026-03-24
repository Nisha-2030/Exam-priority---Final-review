import React, { useState } from 'react';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentRegister = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert('You must agree to the terms');
      return;
    }
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, password);
      navigate('/student-dashboard');
    } catch (err) {
      alert(err || 'Registration failed');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-info">
          <h2>Welcome to student portal</h2>
          <p>Create your account to get started</p>
          <div className="register-quote">
            <p>Nothing will work unless you do</p>
          </div>
        </div>
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="register-subtitle">Fill in your details below</p>
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="register-row">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="agree">Agree with Terms & Conditions</label>
            </div>
            <button type="submit" className="btn-submit">Create account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
