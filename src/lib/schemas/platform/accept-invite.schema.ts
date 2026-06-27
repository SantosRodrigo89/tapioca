import { z } from "zod";

export const AcceptInviteFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(128, "Senha deve ter no máximo 128 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type AcceptInviteFormInput = z.infer<typeof AcceptInviteFormSchema>;

/** API body when creating account via invite (session path uses empty body). */
export const AcceptInviteSchema = AcceptInviteFormSchema;
export type AcceptInviteInput = AcceptInviteFormInput;
