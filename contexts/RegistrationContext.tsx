import React, { createContext, ReactNode, useContext, useState } from 'react';

export type RegistrationData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  acceptedTerms: boolean;
  interests: string[];
};

const defaultData: RegistrationData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  acceptedTerms: false,
  interests: [],
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
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used within RegistrationProvider');
  return ctx;
} 