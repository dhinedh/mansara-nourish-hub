import React from 'react';
import { Leaf, Heart, Sparkles, Shield } from 'lucide-react';

const trustItems = [
  {
    icon: Leaf,
    title: 'Pure Ingredients',
    description: 'Carefully selected, natural ingredients'
  },
  {
    icon: Heart,
    title: 'Honest Food',
    description: 'No shortcuts, no compromises'
  },
  {
    icon: Sparkles,
    title: 'Traditional Wisdom',
    description: 'Time-tested recipes & methods'
  },
  {
    icon: Shield,
    title: 'Quality Promise',
    description: 'Every product meets our standards'
  }
];

const TrustStrip: React.FC = () => {
  return (
    <section className="py-12 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-hover transition-all duration-500 transform hover:-translate-y-1 border border-border/50 group">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-heading font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
