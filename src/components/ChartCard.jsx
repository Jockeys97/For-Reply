import React from 'react';

export default function ChartCard({ title, children }) {
  return (
    <section className="card">
      <div className="card-header">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      </div>
      <div className="card-body">
        <div className="w-full h-64">{children}</div>
      </div>
    </section>
  );
}


