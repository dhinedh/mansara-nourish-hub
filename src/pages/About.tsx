import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Target, Eye, Shield, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import TrustStrip from '@/components/TrustStrip';
import PageHero from '@/components/layout/PageHero';
import { useContent } from '@/context/ContentContext';

const About: React.FC = () => {
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
                <span className="text-5xl float-left font-heading text-brand-yellow mr-3 -mt-2">M</span>
                ANSARA began its journey with a focus on pure, traditionally prepared cooking essentials — Groundnut oil, Sesame oil, Coconut oil, and Ghee — made with an uncompromising commitment to quality, purity, and honesty.
              </p>
              <p>
                As trust grew, so did our offerings. We expanded into nutritious porridge mixes such as Urad Porridge Mix and Kavuni Porridge Mix, and later introduced authentic millet idly podi — combining traditional recipes with modern-day convenience.
              </p>
              <p>
                Each product is designed to be easy to cook, clean in ingredients, and gentle in processing, making healthy eating practical for today’s lifestyle.
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
              <p className="text-lg">
                MANSARA was founded by <strong className="text-brand-blue">Deepika Harikrishnan</strong>, driven by her personal journey and lived experience with hormonal health challenges.
              </p>
              <p>
                Through this journey, she realized the powerful role that clean, balanced, and traditional foods play in supporting overall well-being. Her aim was never to create “special diet food,” but to make everyday food better, purer, and more nourishing — so families can support their health naturally through what they eat daily.
              </p>
              <div className="relative mt-8 p-6 bg-white rounded-xl shadow-sm border-l-4 border-brand-yellow">
                <Sparkles className="absolute -top-3 -right-3 h-6 w-6 text-brand-yellow" />
                <p className="italic text-foreground font-medium text-lg">
                  "MANSARA reflects this belief — that food should support the body, not burden it, and that long-term wellness begins with mindful, honest nourishment."
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-card border border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-blue mx-auto relative z-10 border-4 border-white shadow-md">
                  <Heart className="h-10 w-10 fill-current" />
                </div>

                <div className="text-center relative z-10">
                  <h3 className="font-heading text-3xl font-bold text-brand-blue mb-3">
                    Deepika Harikrishnan
                  </h3>
                  <p className="text-brand-orange font-bold uppercase tracking-wider text-sm mb-6">Founder</p>
                  <div className="w-16 h-1 bg-brand-yellow/30 mx-auto rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What MANSARA Stands For */}
      <section className="py-20 bg-brand-blue text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-yellow via-transparent to-transparent pointer-events-none" />

        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-brand-yellow text-sm font-semibold mb-4 backdrop-blur-sm">
              Our Values
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
              What MANSARA Stands For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { letter: 'M', title: 'Modern', desc: 'Cloud-Enabled Quality. Using modern systems to ensure transparency, consistency, and trust.' },
              { letter: 'A', title: 'Authentic', desc: 'Heart-Centered Nutrition. Products created with genuine care for family health.' },
              { letter: 'N', title: 'Naturally', desc: 'Clean Ingredients. Pure, safe, and wholesome — free from unnecessary additives.' },
              { letter: 'S', title: 'Smart', desc: 'Sustainable Systems. Responsible processes that respect people, resources, and the planet.' },
              { letter: 'A', title: 'Advanced', desc: 'Light Processing. Gentle methods that help retain natural nutrients and freshness.' },
              { letter: 'R', title: 'Reliable', desc: '& Responsible. A brand that stands by its values at every step.' },
              { letter: 'A', title: 'Always', desc: 'Pure. An unwavering commitment to honesty and purity.' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 group hover:-translate-y-1 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-xl flex items-center justify-center text-brand-blue font-bold text-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    {item.letter}
                  </div>
                  <h4 className="font-heading font-semibold text-lg text-brand-yellow">{item.title}</h4>
                </div>
                <p className="text-blue-50/80 text-sm leading-relaxed border-t border-white/10 pt-4 mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <p className="text-muted-foreground leading-relaxed text-lg">
                To become a trusted wellness food brand that supports healthier lifestyles by offering pure, nourishing food rooted in tradition and enhanced by modern practices.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-border/50 hover:shadow-hover transition-shadow duration-300 h-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6 text-brand-green">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <ul className="space-y-4">
                {[
                  "To provide clean, wholesome foods inspired by traditional wisdom",
                  "To support everyday wellness through simple, nourishing ingredients",
                  "To create easy-to-cook products suited for modern living",
                  "To maintain purity, transparency, and responsibility across all processes"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-brand-green" />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
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
