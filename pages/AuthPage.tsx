import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Button, Input } from '../components/ui';
import { useStore } from '../context';
import { Phone, User as UserIcon } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (formData.otp === '1234') {
        login({ name: formData.name, phone: formData.phone });
        navigate('/menu/default/1');
      } else {
        alert('Invalid OTP. Use 1234');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-md bg-surface/90 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl animate-slide-up">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-textSecondary">Enter your details to start ordering</p>
            </div>
            
            <Input 
              label="Full Name"
              placeholder="John Doe" 
              icon={<UserIcon size={18} />}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <Input 
              label="Phone Number"
              type="tel" 
              placeholder="(555) 000-0000" 
              icon={<Phone size={18} />}
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              required
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Verification</h2>
              <p className="text-textSecondary">Enter the 4-digit code sent to your phone</p>
            </div>

            <div className="flex flex-col items-center">
               <input
                type="text"
                maxLength={4}
                className="w-full text-center text-4xl font-bold tracking-[1em] bg-transparent border-b-2 border-border focus:border-primary outline-none py-4 text-white placeholder-white/10"
                placeholder="0000"
                value={formData.otp}
                onChange={e => setFormData({...formData, otp: e.target.value})}
                autoFocus
              />
              <p className="text-xs text-textSecondary mt-4">Demo OTP: <span className="text-primary font-bold">1234</span></p>
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Verify & Continue
            </Button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-sm text-textSecondary hover:text-white transition-colors"
            >
              Back to details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
