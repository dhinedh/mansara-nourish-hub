import React from 'react';
import { Link } from 'react-router-dom';
import { Percent, Package, Sparkles } from 'lucide-react';

const highlights = [
  {
    title: 'Offers',
    description: 'Special prices on your favorites',
    icon: Percent,
    path: '/offers',
    bgClass: 'bg-brand-light-yellow',
    iconBg: 'bg-primary',
    hoverBg: 'hover:bg-primary/10'
  },
  {
    title: 'Combos',
    description: 'Save more with value packs',
    icon: Package,
    path: '/combos',
    bgClass: 'bg-accent/10',
    iconBg: 'bg-accent',
    hoverBg: 'hover:bg-accent/20'
  },
  {
    title: 'New Arrivals',
    description: 'Fresh additions to our family',
    icon: Sparkles,
    path: '/new-arrivals',
    bgClass: 'bg-brand-cream',
    iconBg: 'bg-brand-blue',
    hoverBg: 'hover:bg-brand-blue/10'
  }
];

const HighlightCards: React.FC = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.title} 
                to={item.path}
                className={`${item.bgClass} ${item.hoverBg} rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-hover group`}
              >
                <div className={`${item.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-brand-cream" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                <div className="mt-4 text-accent font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Explore →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightCards;
