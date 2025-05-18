// lib/zodSchemas.ts
import { z } from "zod";

/**
 * Схема проверки ввода при создании/обновлении поста
 */
export const PostInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Заголовок минимум 3 символа" })
    .max(100, { message: "Заголовок до 100 символов" }),
  content: z.string().min(10, { message: "Содержание минимум 10 символов" }),
});

// Тип для TS
export type PostInput = z.infer<typeof PostInputSchema>;
