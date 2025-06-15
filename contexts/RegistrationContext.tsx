import React, { createContext, ReactNode, useContext, useState } from 'react';
import { RegistrationData } from '../types';

const defaultData: RegistrationData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  acceptedTerms: false,
  interests: [],
  city: '',
};

type RegistrationContextType = {
  data: RegistrationData;
  setData: (data: Partial<RegistrationData>) => void;
  reset: () => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<RegistrationData>(defaultData);

  const setData = (newData: Partial<RegistrationData>) => {
    setDataState((prev) => ({ ...prev, ...newData }));
  };

  const reset = () => setDataState(defaultData);

  return (
    <RegistrationContext.Provider value={{ data, setData, reset }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
} 