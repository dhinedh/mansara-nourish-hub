import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-brand-cream">
      <div className="container py-12">
        <div className="mb-8">
          <img src={logo} alt="Mansara Foods" className="h-12 w-auto brightness-0 invert opacity-90" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Get to Know Us */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Get to Know Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  About MANSARA
                </Link>
              </li>
              <li>
                <a href="#" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  Press Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Connect with Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  Delivery & Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">
                  Refund and Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-brand-cream/20 mt-10 pt-8 text-center">
          <p className="text-brand-cream/60 text-sm">
            <span className="text-brand-yellow font-heading font-semibold">MANSARA FOODS</span> — Nourish from Within – The Power of MANSARA
          </p>
          <p className="text-brand-cream/40 text-xs mt-2">
            © {new Date().getFullYear()} MANSARA Foods. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
