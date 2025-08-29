// src/types/supplier.ts
export interface Supplier {
  proveedorID: number; // Siempre es bueno tener un ID
  razonSocial: string;
  nombreComercial: string;
  identificacionTributaria: string; // 11 dígitos
  numeroTelefonico: string;
  correoElectronico: string;
  sitioWeb?: string; // Opcional
  direccionFisica: string;
  pais: string;
  facturacionAnualUSD: number;
  fechaUltimaEdicion: string; // Usaremos string para simplicidad, ej. "YYYY-MM-DD"
}