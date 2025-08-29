import { z } from 'zod';

export const loginSchema = z.object({
  nombreUsuario: z.string().min(1, { message: 'El nombre de usuario es obligatorio.' }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;


export const supplierSchema = z.object({
  nombreComercial: z.string().min(1, { message: 'El nombre comercial es obligatorio.' }),
  razonSocial: z.string().min(1, { message: 'La razón social es obligatoria.' }),
  identificacionTributaria: z.string().length(11, { message: 'El ID Tributario debe tener exactamente 11 dígitos.' }),
  pais: z.string().min(1, { message: 'El país es obligatorio.' }),
  numeroTelefonico: z.string().min(7, { message: 'El número de teléfono no es válido.' }),
  correoElectronico: z.string().email({ message: 'El formato del correo electrónico no es válido.' }),
  sitioWeb: z.string().url({ message: 'La URL del sitio web no es válida.' }).optional().or(z.literal('')), 
  facturacionAnualUSD: z.number()
  .min(1, { message: "La facturación es obligatoria." })
  .transform(val => Number(val))
  .refine(num => num > 0, { message: "La facturación debe ser un número positivo." }),
  direccionFisica: z.string().min(5, { message: 'La dirección es obligatoria.' }),
  
  id: z.number().optional(),
  fechaUltimaEdicion: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;