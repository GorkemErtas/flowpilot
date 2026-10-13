import { z } from "zod";

import { serviceOptions, type ServiceType } from "./types";

const serviceValues = serviceOptions.map((option) => option.value) as [
  ServiceType,
  ...ServiceType[],
];

export const serviceRequestSchema = z
  .object({
    fullName: z
      .string({ required_error: "Ad soyad alanı zorunludur." })
      .trim()
      .min(2, "Ad soyad en az 2 karakter olmalıdır.")
      .max(100, "Ad soyad en fazla 100 karakter olabilir."),
    email: z
      .string({ required_error: "E-posta adresi zorunludur." })
      .trim()
      .toLowerCase()
      .email("Geçerli bir e-posta adresi girin.")
      .max(254, "E-posta adresi en fazla 254 karakter olabilir."),
    service: z.enum(serviceValues, {
      errorMap: () => ({ message: "Listeden geçerli bir hizmet seçin." }),
    }),
    description: z
      .string({ required_error: "Talep açıklaması zorunludur." })
      .trim()
      .min(10, "Talep açıklaması en az 10 karakter olmalıdır.")
      .max(2000, "Talep açıklaması en fazla 2000 karakter olabilir."),
  })
  .strict();

export type ServiceRequestPayload = z.infer<typeof serviceRequestSchema>;
