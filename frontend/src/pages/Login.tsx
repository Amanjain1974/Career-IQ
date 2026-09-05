import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginStep1, loginStep2 } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2 state
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasPhone, setHasPhone] = useState(true);
  
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const data = await loginStep1({ username, password });
      setHasPhone(data.has_phone);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid username or password');
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const payload: any = { username, otp };
      if (!hasPhone) {
        payload.phone_number = phoneNumber;
      }
      const data = await loginStep2(payload);
      login(data.access);
      navigate('/app');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
      <Link to="/" className="absolute top-8 left-8 text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
        CareerIQ
      </Link>
      
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Login to CareerIQ</h2>
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleStep1} 
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Continue
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleStep2} 
              className="space-y-4"
            >
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-lg mb-4 text-sm text-indigo-800 dark:text-indigo-300">
                An OTP has been sent via SMS to your registered mobile number.
              </div>
              
              {!hasPhone && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Link a Phone Number</label>
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter 6-digit OTP</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center tracking-[0.5em] font-mono text-lg" 
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Verify & Sign In
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full bg-transparent text-slate-500 py-2 rounded-lg hover:text-slate-700 dark:hover:text-slate-300 transition-colors text-sm">
                Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        
        {step === 1 && (
          <div className="mt-6 text-center">
            <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Don't have an account? Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

