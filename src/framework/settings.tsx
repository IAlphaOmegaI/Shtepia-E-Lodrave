'use client';

import React, { createContext, useContext } from 'react';

interface Settings {
  maintenance?: {
    start?: string;
  };
  useGoogleMap?: boolean;
  enableEmailForDigitalProduct?: boolean;
  [key: string]: any;
}

interface SettingsContextType {
  settings: Settings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{
  children: React.ReactNode;
  settings?: Settings;
}> = ({ children, settings = {} }) => {
  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};