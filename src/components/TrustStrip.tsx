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
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6 text-brand-blue" />
                </div>
                <h4 className="font-heading font-semibold text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-sm">
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
