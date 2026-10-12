import { z } from "zod";

export const mobileField = z
  .string()
  .trim()
  .min(10)
  .max(13)
  .regex(/^(?:\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number.");

export const sendOtpSchema = z.object({
  mobile: mobileField,
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to continue." }),
  }),
}).strict();

export const verifyOtpSchema = z.object({
  mobile: mobileField,
  otp: z.string().regex(/^\d{4}$/, "Enter the 4-digit verification code."),
}).strict();

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M} .'-]+$/u, "Enter a valid name."),
  mobile: mobileField,
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to continue." }),
  }),
}).strict();

export const updateLeadSchema = z.object({
  employmentType: z.enum(["salaried", "self_employed", "business_owner", "other"]),
  monthlyIncome: z.number().int().min(1).max(100000000),
  city: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M} .'-]+$/u, "Enter a valid city."),
  pan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN."),
  requestedAmount: z.number().int().min(10000).max(100000000),
  attribution: z.object({
    pageUrl: z.string().max(2048).optional(),
    referrer: z.string().max(2048).optional(),
    utmSource: z.string().max(120).optional(),
    utmMedium: z.string().max(120).optional(),
    utmCampaign: z.string().max(120).optional(),
    utmTerm: z.string().max(120).optional(),
    utmContent: z.string().max(120).optional(),
  }).strict().optional(),
}).strict();
