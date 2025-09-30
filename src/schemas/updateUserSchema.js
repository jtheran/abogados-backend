import { z } from "zod";
import validator from "validator";

export const usuarioUpdateSchema = z.object({
    nombre: z
        .string()
        .min(4, { message: "El nombre debe tener al menos 4 caracteres" })
        .max(50, { message: "El nombre no puede exceder 50 caracteres" })
        .optional(),

    documento: z
        .string()
        .min(10, { message: "El documento debe tener al menos 10 caracteres" }),

    tipoDocumento: z.enum(["CC", "TI", "CE", "NIT", "PASAPORTE"], {
        message: "Tipo de documento inválido",
    }),

    
    telefono: z
        .string()
        .optional()
        .refine(
        (value) =>
            !value || validator.isMobilePhone(value, "es-CO"),
        { message: "El número de teléfono no es válido para Colombia" }
        ),

    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .refine((value) => !value || validator.isStrongPassword(value, { minSymbols: 1 }), {
        message:
            "La contraseña debe incluir mayúsculas, minúsculas, números y símbolos",
        })
        .optional(),

});
