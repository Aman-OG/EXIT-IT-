import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-b border-neutral-200 dark:border-neutral-800 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-neutral-200 dark:border-neutral-800 ${className}`} {...props}>
    {children}
  </div>
);

export const StatCard = ({ icon: Icon, label, value, colorClass = 'bg-primary/10 text-primary' }) => (
  <div className="group bg-card p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center space-x-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-300">
    <div className={`p-4 rounded-xl transition-transform group-hover:scale-110 ${colorClass}`}>
      <Icon size={26} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-text/60 text-sm font-semibold tracking-wide uppercase mb-0.5 truncate">{label}</p>
      <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors truncate">{value}</h3>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action, actionText }) => (
  <Card className="p-16">
    <div className="text-center flex flex-col items-center">
      {Icon && <Icon size={48} className="mx-auto text-text/30 mb-4" />}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-text/60 text-lg mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  </Card>
);
