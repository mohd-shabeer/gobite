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
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (formData.otp === '1234') {
        login({ name: formData.name, phone: formData.phone });
        // Navigate to the base menu route which handles table selection
        navigate('/menu');
      } else {
        alert('Invalid OTP. Use 1234');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />
      
      <div className="relative z-10 w-full max-w-md bg-surface/90 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl animate-slide-up">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome</h2>
              <p className="text-textSecondary text-sm">Enter your details to start your dining journey</p>
            </div>
            
            <Input 
              label="Full Name"
              placeholder="Your Name" 
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

            <Button type="submit" className="w-full py-4 text-lg" isLoading={loading}>
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">One More Step</h2>
              <p className="text-textSecondary text-sm">Enter the 4-digit code sent to your phone</p>
            </div>

            <div className="flex flex-col items-center mb-4">
               <input
                type="text"
                maxLength={4}
                className="w-full text-center text-5xl font-bold tracking-[0.5em] bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-4 text-white placeholder-white/5 transition-all"
                placeholder="0000"
                value={formData.otp}
                onChange={e => setFormData({...formData, otp: e.target.value})}
                autoFocus
              />
              <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <p className="text-xs text-primary font-bold">DEMO MODE:</p>
                <p className="text-xs text-white">Use code <span className="font-black">1234</span></p>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg" isLoading={loading}>
              Verify & Start Ordering
            </Button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-sm font-medium text-textSecondary hover:text-white transition-colors"
            >
              Go back to edit details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};