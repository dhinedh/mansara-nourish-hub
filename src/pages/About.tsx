import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Target, Eye, Shield, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import TrustStrip from '@/components/TrustStrip';

const About: React.FC = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-brand-light-yellow py-20">
        <div className="container text-center">
          <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Leaf className="h-4 w-4" />
            Our Story
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-brand-blue mb-4">
            About MANSARA
          </h1>
          <p className="text-xl text-accent font-heading font-semibold mb-4">
            Nourish from Within – The Power of MANSARA
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MANSARA was founded in December 2020 with a deep personal purpose — to make pure, nourishing food a part of everyday life, especially for those seeking better balance, wellness, and long-term health.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-brand-blue mb-6">Our Story</h2>
            <div className="prose text-muted-foreground space-y-4">
              <p>
                MANSARA began its journey with a focus on pure, traditionally prepared cooking essentials — Groundnut oil, Sesame oil, Coconut oil, and Ghee — made with an uncompromising commitment to quality, purity, and honesty.
              </p>
              <p>
                As trust grew, so did our offerings. We expanded into nutritious porridge mixes such as Urad Porridge Mix and Kavuni Porridge Mix, and later introduced authentic millet idly podi — combining traditional recipes with modern-day convenience.
              </p>
              <p>
                Each product is designed to be easy to cook, clean in ingredients, and gentle in processing, making healthy eating practical for today's lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-brand-blue mb-2">
                Founder's Note
              </h3>
              <p className="text-accent font-semibold mb-4">Deepika Harikrishnan</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-4">
                MANSARA was founded by Deepika Harikrishnan, driven by her personal journey and lived experience with hormonal health challenges.
              </p>
              <p className="text-muted-foreground mb-4">
                Through this journey, she realized the powerful role that clean, balanced, and traditional foods play in supporting overall well-being. Her aim was never to create "special diet food," but to make everyday food better, purer, and more nourishing — so families can support their health naturally through what they eat daily.
              </p>
              <p className="text-foreground font-medium">
                MANSARA reflects this belief — that food should support the body, not burden it, and that long-term wellness begins with mindful, honest nourishment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What MANSARA Stands For */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-brand-blue mb-10 text-center">
            What MANSARA Stands For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { letter: 'M', title: 'Modern', desc: 'Cloud-Enabled Quality' },
              { letter: 'A', title: 'Authentic', desc: 'Heart-Centered Nutrition' },
              { letter: 'N', title: 'Naturally', desc: 'Clean Ingredients' },
              { letter: 'S', title: 'Smart', desc: 'Sustainable Systems' },
              { letter: 'A', title: 'Advanced', desc: 'Light Processing' },
              { letter: 'R', title: 'Reliable', desc: '& Responsible' },
              { letter: 'A', title: 'Always', desc: 'Pure' },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-5 shadow-card text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-heading font-bold text-xl">{item.letter}</span>
                </div>
                <h4 className="font-heading font-semibold text-foreground">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-brand-light-yellow">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-card">
              <Eye className="h-10 w-10 text-brand-blue mb-4" />
              <h3 className="font-heading text-2xl font-bold text-brand-blue mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become a trusted wellness food brand that supports healthier lifestyles by offering pure, nourishing food rooted in tradition and enhanced by modern practices.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-card">
              <Target className="h-10 w-10 text-brand-blue mb-4" />
              <h3 className="font-heading text-2xl font-bold text-brand-blue mb-4">Our Mission</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Provide clean, wholesome foods inspired by traditional wisdom</li>
                <li>• Support everyday wellness through simple, nourishing ingredients</li>
                <li>• Create easy-to-cook products suited for modern living</li>
                <li>• Maintain purity, transparency, and responsibility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-16 bg-background">
        <div className="container text-center">
          <Shield className="h-16 w-16 text-brand-blue mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold text-brand-blue mb-4">Our Promise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            At MANSARA, we believe true nourishment starts from within. Every product we create is a step toward better balance, mindful eating, and long-term well-being.
          </p>
          <Link to="/products">
            <Button variant="default" size="lg">
              Explore Our Products
            </Button>
          </Link>
        </div>
      </section>

      <TrustStrip />
    </Layout>
  );
};

export default About;
