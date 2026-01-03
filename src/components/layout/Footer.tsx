import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

import { useContent } from '@/context/ContentContext';

const Footer: React.FC = () => {
  const { settings } = useContent();

  return (
    <footer className="bg-[#131A4E] text-brand-cream border-t border-brand-cream/10">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Brand & Address */}
          <div>
            <div className="mb-6">
              <img src={logo} alt="Mansara Foods" className="h-20 w-auto object-contain bg-brand-cream p-2 rounded-xl" />
            </div>
            <address className="not-italic text-brand-cream/70 text-sm space-y-2">
              <p className="font-semibold text-brand-yellow">MansaraFoods Private Limited</p>
              <p className="whitespace-pre-line">{settings?.address || 'Tamil Nadu, India'}</p>
              <p>Email: {settings?.contact_email || 'mansarafoods@gmail.com'}</p>
              <p>Phone: {settings?.phone_number || '+91-883 888 7064'}</p>
            </address>
          </div>

          {/* Get to Know Us */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Get to Know Us</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">About Us</Link></li>
              <li><span className="text-brand-cream/50 cursor-not-allowed">Career</span></li>
              <li><span className="text-brand-cream/50 cursor-not-allowed">Press Releases</span></li>
              <li><span className="text-brand-cream/50 cursor-not-allowed">Blog</span></li>
            </ul>
          </div>

          {/* Connect & Help */}
          <div>
            <div className="mb-8">
              <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Connect with Us</h3>
              <div className="flex gap-4">
                <a href={settings?.facebook_url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={settings?.twitter_url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href={settings?.instagram_url || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Help</h3>
              <ul className="space-y-2">
                <li><Link to="/orders" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Track Your Order</Link></li>
                <li><Link to="/contact" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Consumer Policy */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Consumer Policy</h3>
            <ul className="space-y-2">
              <li><Link to="/terms-and-conditions" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Privacy Policy</Link></li>
              <li><Link to="/delivery-shipping-policy" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Delivery & Shipping Policy</Link></li>
              <li><Link to="/refund-return-policy" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Refund & Return Policy</Link></li>
            </ul>
            <div className="mt-6 p-3 bg-brand-cream/5 rounded text-xs text-brand-cream/60">
              <p className="font-semibold text-brand-yellow mb-1">International Compliance:</p>
              <p>We comply with Indian export regulations. Customs clearance is the customer's responsibility.</p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-brand-cream/20 pt-8 text-center">
          <p className="text-brand-cream/60 text-sm">
            <span className="text-brand-yellow font-heading font-semibold">MANSARA FOODS</span> — Nourish from Within
          </p>
          <p className="text-brand-cream/40 text-xs mt-2">
            © 2026 | Designed & Developed by Zech Soft , hence ensuring quality & reliability
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

