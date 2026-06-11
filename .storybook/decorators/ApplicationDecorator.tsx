import React from 'react';

export const ApplicationDecorator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ padding: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</div>;
};

export default ApplicationDecorator;
