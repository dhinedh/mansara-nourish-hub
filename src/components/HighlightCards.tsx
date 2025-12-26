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
    <section className="py-10 sm:py-12 lg:py-14 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 xl:gap-10">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.path}
                className={`${item.bgClass} ${item.hoverBg} rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-hover group`}
              >
                <div className={`${item.iconBg} w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-brand-cream" />
                </div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-3 sm:mt-4 text-accent font-semibold text-xs sm:text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
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