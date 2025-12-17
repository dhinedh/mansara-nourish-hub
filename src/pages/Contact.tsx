import React from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const { toast } = useToast();

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
      <section className="bg-brand-light-yellow py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-blue mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products, feedback to share, or would like to collaborate with us.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-blue mb-8">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Our Address</h4>
                    <p className="text-muted-foreground text-sm">
                      MANSARA FOODS<br />
                      No. 15, Government Hospital Opposite,<br />
                      Timiri Road, Kalavai, Ranipet,<br />
                      Tamil Nadu – 632506, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Email Us</h4>
                    <a href="mailto:mansarafoods@gmail.com" className="text-accent hover:underline">
                      mansarafoods@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-brand-cream" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Call / WhatsApp</h4>
                    <a href="tel:+918838887064" className="text-accent hover:underline">
                      +91 88388 87064
                    </a>
                    <p className="text-muted-foreground text-sm">(Available during business hours)</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-secondary rounded-xl">
                <h4 className="font-heading font-semibold text-foreground mb-3">Get in Touch For:</h4>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li>• Product information</li>
                  <li>• Orders & availability</li>
                  <li>• Feedback & suggestions</li>
                  <li>• Collaborations & partnerships</li>
                  <li>• General enquiries</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h2 className="font-heading text-2xl font-bold text-brand-blue mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <Button type="submit" variant="default" size="lg" className="w-full">
                  <Send className="h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-12 bg-secondary">
        <div className="container text-center">
          <p className="text-muted-foreground">
            🌿 <span className="font-semibold text-foreground">Our Commitment:</span> Every message matters to us. We respond with the same care, honesty, and responsibility that define MANSARA.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
