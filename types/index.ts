// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Registration Types
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  acceptedTerms: boolean;
  interests: string[]; // Array of interest IDs
}

// Category Types
export interface Interest {
  id: string;
  name: string;
}

// Service Types
export interface ServiceError {
  message: string;
  status?: number;
} 