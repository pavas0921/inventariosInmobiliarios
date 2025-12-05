export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T; // Datos opcionales (genéricos)
  error?: string; // Mensaje de error opcional
}
