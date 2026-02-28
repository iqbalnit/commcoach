export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

type FieldSpec =
  | { type: "string"; minLength?: number; maxLength?: number; optional?: boolean }
  | { type: "number"; min?: number; max?: number; optional?: boolean }
  | { type: "array"; optional?: boolean };

/**
 * Validate a parsed request body against a simple schema.
 * Throws ValidationError with a user-friendly message on failure.
 */
export function validateBody(
  body: unknown,
  schema: Record<string, FieldSpec>
): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Request body must be a JSON object");
  }

  const obj = body as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, spec] of Object.entries(schema)) {
    const value = obj[key];

    if (value === undefined || value === null) {
      if (!spec.optional) {
        throw new ValidationError(`Missing required field: ${key}`);
      }
      result[key] = undefined;
      continue;
    }

    if (spec.type === "string") {
      if (typeof value !== "string") {
        throw new ValidationError(`${key} must be a string`);
      }
      if (spec.minLength !== undefined && value.length < spec.minLength) {
        throw new ValidationError(`${key} must be at least ${spec.minLength} characters`);
      }
      if (spec.maxLength !== undefined && value.length > spec.maxLength) {
        throw new ValidationError(`${key} must be at most ${spec.maxLength} characters`);
      }
    } else if (spec.type === "number") {
      if (typeof value !== "number" || !isFinite(value)) {
        throw new ValidationError(`${key} must be a number`);
      }
      if (spec.min !== undefined && value < spec.min) {
        throw new ValidationError(`${key} must be at least ${spec.min}`);
      }
      if (spec.max !== undefined && value > spec.max) {
        throw new ValidationError(`${key} must be at most ${spec.max}`);
      }
    } else if (spec.type === "array") {
      if (!Array.isArray(value)) {
        throw new ValidationError(`${key} must be an array`);
      }
    }

    result[key] = value;
  }

  return result;
}
