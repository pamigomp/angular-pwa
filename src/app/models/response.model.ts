export interface CustomResponse {
  message: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  error: string | object;
}

export interface AuthResponse {
  _id: string;
  email: string;
  token: string;
}

