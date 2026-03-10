import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminChatViewProps {
    phone: string;
    customerName: string;
}

const AdminChatView: React.FC<AdminChatViewProps> = ({ phone, customerName }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/whatsapp/conversation/${phone}`);
                setMessages(response.data?.messages || []);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch chat history:', err);
                setError('Failed to load conversation history from Botbiz.');
            } finally {
                setLoading(false);
            }
        };

        if (phone) fetchChatHistory();
    }, [phone]);

    return (
        <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden bg-gray-50">
            <div className="p-4 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">{customerName}</h3>
                        <p className="text-xs text-muted-foreground">{phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[#25D366]">
                    <MessageCircle size={16} fill="currentColor" />
                    <span className="text-xs font-medium">WhatsApp</span>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        Loading conversation...
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-sm text-destructive px-4 text-center">
                        {error}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground gap-2">
                        <MessageCircle size={32} className="opacity-20" />
                        No previous messages found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.direction === 'sent'
                                    ? 'bg-[#E7FFDB] text-gray-800 rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.text || msg.message}</p>
                                    <p className="text-[10px] opacity-50 mt-1 text-right">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 bg-white border-t">
                <p className="text-[10px] text-center text-muted-foreground mb-2">
                    Reply directly from your Botbiz Dashboard or linked WhatsApp Business Account.
                </p>
                <Button
                    disabled
                    className="w-full gap-2 opacity-50 cursor-not-allowed"
                    variant="outline"
                >
                    <Send size={14} /> Send a Message
                </Button>
            </div>
        </div>
    );
};

export default AdminChatView;
