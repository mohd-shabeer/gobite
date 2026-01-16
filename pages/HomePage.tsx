import React from 'react';
import { Link } from 'react-router-dom';
import { Logo, Button } from '../components/ui';
import { ScanLine, Utensils, History, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <img 
            src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Restaurant Ambience" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Scan. Order. <span className="text-primary">Enjoy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-textSecondary mb-10 max-w-2xl mx-auto">
            Experience the future of dining. Skip the wait and order directly from your table with Gobite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <Utensils className="w-8 h-8" />, title: 'Browse Menu', desc: 'Explore delicious dishes with beautiful visuals and detailed descriptions.' },
            { icon: <ScanLine className="w-8 h-8" />, title: 'Easy Ordering', desc: 'Scan QR code, customize your meal, and send it to the kitchen instantly.' },
            { icon: <History className="w-8 h-8" />, title: 'Track Orders', desc: 'Keep track of your order status in real-time from preparation to serving.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-surface p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-surfaceLight rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-textSecondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-surface border-t border-border text-center text-textSecondary text-sm">
        <p>&copy; 2024 Gobite. All rights reserved.</p>
      </footer>
    </div>
  );
};