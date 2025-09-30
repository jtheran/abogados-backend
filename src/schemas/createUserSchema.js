import { z } from "zod";
import validator from "validator";

export const usuarioSchema = z.object({
  nombre: z
    .string()
    .min(4, { message: "El nombre debe tener al menos 4 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" }),

  tarjetaProfesional: z
    .string()
    .min(6, { message: "La tarjeta profesional debe tener al menos 6 caracteres" }),

  email: z
    .string()
    .email({ message: "Email inválido" })
    .refine((value) => validator.isEmail(value), {
      message: "Formato de email no válido",
    }),

  telefono: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || validator.isMobilePhone(value, "es-CO"),
      { message: "El número de teléfono no es válido para Colombia" }
    ),

  rol: z.enum(["admin", "abogado", "asistente", "cliente"], {
    message: "El rol debe ser 'admin', 'abogado', 'asistente' o 'cliente'",
  }),

  documento: z
    .string()
    .min(10, { message: "El documento debe tener al menos 10 caracteres" }),

  tipoDocumento: z.enum(["CC", "TI", "CE", "NIT", "PASAPORTE"], {
    message: "Tipo de documento inválido",
  }),

  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .refine((value) => validator.isStrongPassword(value, { minSymbols: 1 }), {
      message:
        "La contraseña debe incluir mayúsculas, minúsculas, números y símbolos",
    }),

  estado: z.boolean().optional().default(true),

  fechaRegistro: z.date().optional(),
});
