import React from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PageHero from '@/components/layout/PageHero';
import { useContent } from '@/context/ContentContext';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const { getContent } = useContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <PageHero pageKey="contact">
        <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/30">
          {getContent('contact', 'intro', "We're Here to Help")}
        </span>
      </PageHero>

      {/* Contact Content */}
      <section className="py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Info */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-10 relative inline-block">
                Get in Touch
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
              </h2>

              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground mb-2">Our Address</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {getContent('contact', 'address', "MANSARA FOODS\nNo. 15, Government Hospital Opposite,\nTimiri Road, Kalavai, Ranipet,\nTamil Nadu – 632506, India")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground mb-2">Email Us</h4>
                    <a href={`mailto:${getContent('contact', 'email', 'mansarafoods@gmail.com')}`} className="text-accent hover:text-accent/80 hover:underline text-lg font-medium transition-colors">
                      {getContent('contact', 'email', 'mansarafoods@gmail.com')}
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-foreground rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-7 w-7 text-background" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-foreground mb-2">Call / WhatsApp</h4>
                    <a href={`tel:${getContent('contact', 'phone', '+91 88388 87064')}`} className="text-accent hover:text-accent/80 hover:underline text-lg font-medium transition-colors">
                      {getContent('contact', 'phone', '+91 88388 87064')}
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">(Available during business hours)</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-secondary/50 rounded-2xl border border-border/50 backdrop-blur-sm">
                <h4 className="font-heading font-semibold text-foreground mb-4 text-lg">Get in Touch For:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {['Product information', 'Orders & availability', 'Feedback & suggestions', 'Visual collaborations', 'Partnerships', 'General enquiries'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-3xl p-8 sm:p-10 shadow-card border border-border/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 ml-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="default" size="lg" className="w-full py-6 text-base btn-shine shadow-lg hover:shadow-xl transition-all">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-12 bg-secondary">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center">
          <p className="text-muted-foreground">
            🌿 <span className="font-semibold text-foreground">Our Commitment:</span> Every message matters to us. We respond with the same care, honesty, and responsibility that define MANSARA.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
