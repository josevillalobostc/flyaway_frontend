import axios from "axios";

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface FlightRequest {
  airlineName: string;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export interface SingleFlightResponse {
  id: number;
  airlineName: string;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: string;
}

export interface FlightResponse {
  flights: SingleFlightResponse[];
}

export interface UserRegisterResponse {
  id: number;
}

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

export const userRegister = async (
  RegisterData: RegisterRequest,
): Promise<UserRegisterResponse> => {
  const response = await api.post("/users/register", RegisterData);
  return response.data;
};

export const userLogin = async (
  LoginData: LoginRequest,
): Promise<TokenResponse> => {
  const response = await api.post("/auth/login", LoginData);
  return response.data;
};
