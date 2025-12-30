import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Target, Eye, Shield, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import TrustStrip from '@/components/TrustStrip';
import PageHero from '@/components/layout/PageHero';
import { useContent } from '@/context/ContentContext';

const About: React.FC = () => {
  const { getContent } = useContent();

  return (
    <Layout>
      {/* Hero */}
      <PageHero pageKey="about">
        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30 animate-fade-in-up">
          <Leaf className="h-4 w-4" />
          Nourish from Within
        </span>
      </PageHero>

      {/* About MANSARA Intro */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-yellow/5 rounded-full blur-3xl -z-10" />

        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center max-w-4xl mx-auto relative z-10 animate-fade-in-up">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-blue mb-8 leading-tight">
            The Power of <span className="text-brand-orange">MANSARA</span>
          </h2>
          <div className="prose prose-lg text-muted-foreground mx-auto">
            <p className="mb-6 text-xl leading-relaxed">
              MANSARA was founded in <span className="font-semibold text-brand-blue">December 2020</span> with a deep personal purpose — to make pure, nourishing food a part of everyday life, especially for those seeking better balance, wellness, and long-term health.
            </p>
            <p className="font-heading font-medium text-2xl text-foreground/80 italic">
              "The brand was born from lived experience, care, and conviction — not just an idea."
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white relative">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="max-w-4xl mx-auto bg-brand-cream/10 rounded-3xl p-8 md:p-12 border border-brand-cream/20 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center mb-10">
              <span className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-2 block">Our Beginning</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue">Our Story</h2>
            </div>

            <div className="prose prose-lg text-muted-foreground space-y-6 whitespace-pre-line leading-relaxed text-justify relative z-10">
              <p>
                {getContent('about', 'story', 'MANSARA began its journey with a focus on pure, traditionally prepared cooking essentials...')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-secondary/30">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1 space-y-6 text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-heading text-2xl font-bold text-brand-blue mb-4 block md:hidden">
                Founder’s Note
              </h3>
              <div className="relative mt-8 p-6 bg-white rounded-xl shadow-sm border-l-4 border-brand-yellow">
                <Sparkles className="absolute -top-3 -right-3 h-6 w-6 text-brand-yellow" />
                <p className="italic text-foreground font-medium text-lg whitespace-pre-line">
                  "{getContent('about', 'founder_note', 'MANSARA reflects this belief — that food should support the body, not burden it...')}"
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-card border border-border/50 relative overflow-hidden group">
                {/* Image placeholder matches existing design */}
                <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-blue mx-auto relative z-10 border-4 border-white shadow-md">
                  <Heart className="h-10 w-10 fill-current" />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="font-heading text-3xl font-bold text-brand-blue mb-3">
                    Deepika Harikrishnan
                  </h3>
                  <p className="text-brand-orange font-bold uppercase tracking-wider text-sm mb-6">Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skipping Values section as it structure is complex list */}

      {/* Vision & Mission */}
      <section className="py-24 bg-brand-light-yellow relative">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-border/50 hover:shadow-hover transition-shadow duration-300 h-full animate-fade-in-up">
              <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 text-brand-orange">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {getContent('about', 'vision', 'To become a trusted wellness food brand...')}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-border/50 hover:shadow-hover transition-shadow duration-300 h-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6 text-brand-green">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {getContent('about', 'mission', 'To provide clean, wholesome foods...')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/3 rounded-full blur-3xl -z-10" />

        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center animate-fade-in-up">
          <Shield className="h-20 w-20 text-brand-blue mx-auto mb-8 opacity-90 drop-shadow-lg" />
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-6">Our Promise</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-10 text-xl leading-relaxed">
            At MANSARA, we believe true nourishment starts from within.
            <br className="hidden sm:block" />
            Every product we create is a step toward <span className="text-brand-orange font-medium">better balance</span>, <span className="text-brand-orange font-medium">mindful eating</span>, and <span className="text-brand-orange font-medium">long-term well-being</span>.
          </p>
          <Link to="/products">
            <Button variant="default" size="lg" className="px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
