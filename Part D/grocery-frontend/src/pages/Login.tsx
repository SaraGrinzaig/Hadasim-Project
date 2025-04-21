import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  console.log('Login loaded')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const { token, role, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'supplier') {
        localStorage.setItem('supplierId', user._id);
        navigate('/supplier');
      }
      else if (role === 'storeOwner') {
        localStorage.setItem('ownerId', user._id);
        navigate('/store-owner');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          Not registered yet? <a href="/register">Register as a new supplier</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
