
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  apiEndpoint: string;
  setApiEndpoint: (endpoint: string) => void;
  isValidEndpoint: (endpoint: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiEndpoint, setApiEndpointState] = useState(() => {
    const saved = localStorage.getItem('apiEndpoint');
    return saved || 'http://192.168.0.56';
  });

  const setApiEndpoint = (endpoint: string) => {
    setApiEndpointState(endpoint);
    localStorage.setItem('apiEndpoint', endpoint);
  };

  const isValidEndpoint = (endpoint: string): boolean => {
    try {
      new URL(endpoint);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem('apiEndpoint', apiEndpoint);
  }, [apiEndpoint]);

  return (
    <SettingsContext.Provider value={{ apiEndpoint, setApiEndpoint, isValidEndpoint }}>
      {children}
    </SettingsContext.Provider>
  );
};
