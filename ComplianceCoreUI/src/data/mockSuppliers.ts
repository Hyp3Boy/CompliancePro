// src/data/mockSuppliers.ts
import type { Supplier } from "../types/supplier";

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    razonSocial: 'Acme Corporation Inc.',
    nombreComercial: 'Acme Corporation',
    identificacionTributaria: '123-456-789',
    numeroTelefonico: '555-0101',
    correoElectronico: 'contact@acme.com',
    sitioWeb: 'https://acme.com',
    direccionFisica: '123 Main St, Anytown, USA',
    pais: 'United States',
    facturacionAnualDolares: 50000000,
    fechaUltimaEdicion: '2023-11-15',
  },
  {
    id: 2,
    razonSocial: 'Global Solutions LLC',
    nombreComercial: 'Global Solutions Inc.',
    identificacionTributaria: '987-654-321',
    numeroTelefonico: '555-0102',
    correoElectronico: 'info@globalsolutions.com',
    direccionFisica: '456 Oak Ave, Business City, Canada',
    pais: 'Canada',
    facturacionAnualDolares: 120000000,
    fechaUltimaEdicion: '2023-10-20',
  },
  // Añade más si quieres
];