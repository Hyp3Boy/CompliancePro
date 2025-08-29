export interface Supplier {
  proveedorID: number; 
  razonSocial: string;
  nombreComercial: string;
  identificacionTributaria: string; 
  numeroTelefonico: string;
  correoElectronico: string;
  sitioWeb?: string;
  direccionFisica: string;
  pais: string;
  facturacionAnualUSD: number;
  fechaUltimaEdicion: string; 
}