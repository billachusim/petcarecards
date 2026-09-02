import { z } from "zod";

/** Deliberately forgiving: international formats, spaces, dashes, parens. */
export const phoneSchema = z
  .string()
  .trim()
  .max(32, "That phone number looks too long.")
  .refine((v) => v === "" || /^[+()\-.\s\d]{5,}$/.test(v), "Please enter a valid phone number.");

export const petSchema = z.object({
  name: z.string().trim().min(1, "Please add your pet's name.").max(60, "That name is too long."),
  breed: z.string().trim().max(80).optional(),
  weight: z.string().trim().max(40).optional(),
  approximateAge: z.string().trim().max(40).optional(),
});

export const medicationSchema = z
  .object({
    name: z.string().trim().min(1, "Please add the medication name.").max(80),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (v) => !v.startDate || !v.endDate || v.startDate <= v.endDate,
    { message: "The end date must be on or after the start date.", path: ["endDate"] },
  );

export const reminderSchema = z
  .object({
    title: z.string().trim().min(1, "Please add a title for this reminder.").max(80),
    time: z.string().min(1, "Please choose a time."),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (v) => !v.startDate || !v.endDate || v.startDate <= v.endDate,
    { message: "The end date must be on or after the start date.", path: ["endDate"] },
  );

export function firstError(error: unknown): string {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? "Please check the form.";
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
