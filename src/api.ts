import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

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
  availableSeats: number;
}

export interface FlightSearch {
  flightNumber?: string;
  airlineName?: string;
  estDepartureTimeFrom?: string;
  estDepartureTimeTo?: string;
}

export interface FlightResponse {
  items: SingleFlightResponse[];
}

export interface UserRegisterResponse {
  id: number;
}

export interface BookingResponse {
  id: number;
}

export interface BookingRequest {
  flightId: number;
}

const api = axios.create({
  baseURL: apiUrl,
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

export const getFlights = async (
  params: FlightSearch,
): Promise<FlightResponse> => {
  const response = await api.get("/flights/search", { params: params });
  return response.data;
};

export const bookFlight = async (
  BookingData: BookingRequest,
  token: string,
): Promise<BookingResponse> => {
  const response = await api.post("flights/book", BookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
