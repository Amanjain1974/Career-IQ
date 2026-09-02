import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, loginStep1, loginStep2 } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      // Step 1: Create user
      await register({ username, email, password, phone_number: phoneNumber });
      
      // Step 2: Trigger OTP
      await loginStep1({ username, password });
      
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Username or email might be taken.');
    }
  };
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const data = await loginStep2({ username, otp, phone_number: phoneNumber });
      login(data.access);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Create an Account</h2>
        
        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email (Optional)</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <input 
                type="text" 
                value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value)} 
                placeholder="+1234567890"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-lg mb-4 text-sm text-indigo-800 dark:text-indigo-300">
              An OTP has been sent via SMS to {phoneNumber}.
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter 6-digit OTP</label>
              <input 
                type="text" 
                maxLength={6}
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-[0.5em] font-mono text-lg" 
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Verify & Complete Registration
            </button>
          </form>
        )}
        
        {step === 1 && (
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Already have an account? Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

