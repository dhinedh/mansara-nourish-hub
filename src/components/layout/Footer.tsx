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
              <img src={logo} alt="Mansara Foods - Traditional Health Mix & Porridge Mixes Chennai" className="h-20 w-auto object-contain bg-brand-cream p-2 rounded-xl" loading="lazy" />
            </div>
            <address className="not-italic text-brand-cream/70 text-sm space-y-2">
              <p className="font-semibold text-brand-yellow">MansaraFoods Private Limited</p>
              <p className="whitespace-pre-line">{settings?.address || 'Chennai, Tamil Nadu, India'}</p>
              <p>Email: {settings?.contact_email || 'contact@mansarafoods.com'}</p>
              <p>Phone: {settings?.phone_number || '+91-883 888 7064'}</p>
            </address>
            <div className="mt-6">
              <h4 className="font-heading font-semibold text-sm text-brand-yellow mb-3">Connect with Us</h4>
              <div className="flex gap-3">
                <a
                  href={settings?.facebook_url && settings.facebook_url !== '#' ? settings.facebook_url : 'https://www.facebook.com/mansarafoods'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Mansara Foods on Facebook"
                  className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={settings?.twitter_url && settings.twitter_url !== '#' ? settings.twitter_url : 'https://twitter.com/mansarafoods'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Mansara Foods on Twitter"
                  className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={settings?.instagram_url && settings.instagram_url !== '#' ? settings.instagram_url : 'https://www.instagram.com/mansarafoods'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Mansara Foods on Instagram"
                  className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Shop by Category */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Shop by Category</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=urad-porridge-mix" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Urad Porridge Mixes</Link></li>
              <li><Link to="/products?category=black-rice-mix" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Black Rice Porridge Mixes</Link></li>
              <li><Link to="/products?category=millet-fusion-mix" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Millet Fusion Mixes</Link></li>
              <li><Link to="/products?category=idly-podi" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Traditional Idly Podi</Link></li>
              <li><Link to="/products?category=rice-mixes" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Rice Podi Mixes</Link></li>
              <li><Link to="/combos" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Special Value Combos</Link></li>
              <li><Link to="/products" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">All Products Catalog</Link></li>
            </ul>
          </div>

          {/* Top Traditional Products */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Top Traditional Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/product/urad-porridge-mix-classic" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Urad Health Mix – Classic</Link></li>
              <li><Link to="/product/black-rice-delight-porridge-mix" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Health Mix – Black Rice Delight</Link></li>
              <li><Link to="/product/urad-porridge-mix-millet-magic" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Urad Health Mix – Millet Magic</Link></li>
              <li><Link to="/product/millet-fusion-idly-podi" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Idly Podi – Millet Fusion</Link></li>
              <li><Link to="/product/nutrimix-super-health-mix" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Nutrimix Super Health Mix</Link></li>
              <li><Link to="/product/karuveppillai-special" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Curry Leaves Rice Podi Mix</Link></li>
            </ul>
          </div>

          {/* Explore, Blog & Policies */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-yellow mb-4">Explore &amp; Policies</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><Link to="/blog" className="text-brand-cream/80 hover:text-brand-yellow transition-colors font-medium">Health &amp; Nutrition Blog</Link></li>
              <li><Link to="/offers" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Discounts &amp; Offers</Link></li>
              <li><Link to="/new-arrivals" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">New Arrivals</Link></li>
              <li><Link to="/about" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">About Mansara Foods</Link></li>
              <li><Link to="/contact" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Contact Us &amp; FAQs</Link></li>
              <li><Link to="/orders" className="text-brand-cream/80 hover:text-brand-yellow transition-colors">Track Your Order</Link></li>
            </ul>

            <div className="pt-4 border-t border-brand-cream/10">
              <ul className="space-y-1 text-xs text-brand-cream/70">
                <li><Link to="/terms-and-conditions" className="hover:text-brand-yellow transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-brand-yellow transition-colors">Privacy Policy</Link></li>
                <li><Link to="/delivery-shipping-policy" className="hover:text-brand-yellow transition-colors">Delivery &amp; Shipping Policy</Link></li>
                <li><Link to="/refund-return-policy" className="hover:text-brand-yellow transition-colors">Refund &amp; Return Policy</Link></li>
                <li><Link to="/careers" className="hover:text-brand-yellow transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-brand-yellow transition-colors">Press Releases</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-brand-cream/20 pt-8 text-center">
          <p className="text-brand-cream/60 text-sm">
            <span className="text-brand-yellow font-heading font-semibold">MANSARA FOODS</span> — Nourish from Within
          </p>
          <p className="text-brand-cream/40 text-xs mt-2">
            © 2026 | Designed & Developed by Mansarafoods , hence ensuring quality & reliability
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

