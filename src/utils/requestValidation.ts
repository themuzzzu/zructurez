
import { toast } from "sonner";
import { z } from "zod";

/**
 * Validates request data against a Zod schema and handles error messaging
 * @param data The data to validate
 * @param schema The Zod schema to validate against
 * @param errorMessage Custom error message to display
 * @returns The validated data or null if validation fails
 */
export const validateRequest = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  errorMessage = 'Invalid request data'
): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Get a more readable error message from the Zod error
      const issues = error.issues.map(issue => issue.message).join(", ");
      toast.error(`${errorMessage}: ${issues}`);
      console.error("Validation error:", issues);
    } else {
      // Handle unexpected errors
      toast.error(errorMessage);
      console.error("Unexpected validation error:", error);
    }
    return null;
  }
};

/**
 * Safely validates request data and executes a callback if validation passes
 * @param data The data to validate
 * @param schema The Zod schema to validate against
 * @param onValid Callback to execute with validated data
 * @param errorMessage Custom error message to display
 */
export const validateAndExecute = <T, R>(
  data: unknown,
  schema: z.ZodSchema<T>,
  onValid: (validData: T) => R,
  errorMessage = 'Invalid request data'
): R | null => {
  const validData = validateRequest(data, schema, errorMessage);
  if (validData === null) return null;
  try {
    return onValid(validData);
  } catch (error) {
    console.error("Error executing callback after validation:", error);
    toast.error("An error occurred while processing your request");
    return null;
  }
};
