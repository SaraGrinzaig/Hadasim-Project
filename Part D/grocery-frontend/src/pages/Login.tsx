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

      if (role === 'supplier'){
        localStorage.setItem('supplierId', user._id);
        navigate('/supplier');
      } 
      else if (role === 'storeOwner'){
        localStorage.setItem('ownerId', user._id);
        navigate('/store-owner');
      } 
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
        <input required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>

    </div>
  );
}

export default Login;
