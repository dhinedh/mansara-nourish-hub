import React from 'react';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

interface WhatsAppBuyButtonProps {
    product: any;
    variant?: any;
    className?: string;
}

const WhatsAppBuyButton: React.FC<WhatsAppBuyButtonProps> = ({ product, variant, className = "" }) => {
    const handleWhatsAppOrder = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const phoneNumber = import.meta.env.VITE_BOTBIZ_PHONE_NUMBER || '91XXXXXXXXXX';
        const price = variant ? variant.price : product.price;
        const name = product.name + (variant ? ` (${variant.weight})` : '');

        const message = `Namaste Mansara Foods! 🙏 I'm interested in buying: *${name}* (Price: ₹${price}). Could you please help me with the order?`;
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Log lead in background
        try {
            const storedUser = localStorage.getItem('user');
            const user = storedUser ? JSON.parse(storedUser) : null;

            await axios.post(`${import.meta.env.VITE_API_URL}/whatsapp/order-lead`, {
                phone: user?.phone || 'Guest',
                name: user?.name || 'Guest User',
                productInfo: {
                    id: product.id || product._id,
                    name: name,
                    price: price
                }
            });
        } catch (error) {
            console.error('Failed to log WhatsApp lead:', error);
        }

        // Redirect to WhatsApp
        window.open(waUrl, '_blank');
    };

    return (
        <button
            onClick={handleWhatsAppOrder}
            className={`flex items-center justify-center gap-2 py-2 px-4 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-all hover:scale-[1.02] shadow-sm ${className}`}
        >
            <MessageCircle size={18} fill="currentColor" />
            Order via WhatsApp
        </button>
    );
};

export default WhatsAppBuyButton;
