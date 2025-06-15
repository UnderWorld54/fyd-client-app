// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  email: string;
  password: string;
  city: string;
  interests: string[];
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      age: number;
      role: string;
      isActive: boolean;
      refreshToken: string;
      interests: string[];
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    token: string;
    refreshToken: string;
  };
  message: string;
}

// Registration Types
export type RegistrationData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  acceptedTerms: boolean;
  interests: string[];
  city: string;
};

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