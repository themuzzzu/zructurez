
import { z } from "zod";
import { toast } from "sonner";

/**
 * Validates data against a Zod schema
 * @param data Data to validate
 * @param schema Zod schema to validate against
 * @param errorMessage Optional custom error message
 * @returns Validated data or null if validation fails
 */
export const validateRequest = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  errorMessage: string = "Invalid request data"
): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format error messages
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      // Show toast with error details
      toast.error(`${errorMessage}: ${formattedErrors}`);
      console.error("Validation error:", error.errors);
    } else {
      // Handle unexpected errors
      toast.error(errorMessage);
      console.error("Unexpected validation error:", error);
    }
    return null;
  }
};

/**
 * Creates a request validator for a specific schema
 * @param schema Zod schema to validate against
 * @param errorMessage Optional custom error message
 * @returns Function that validates data against the schema
 */
export const createValidator = <T>(
  schema: z.ZodSchema<T>,
  errorMessage?: string
) => {
  return (data: unknown): T | null => 
    validateRequest(data, schema, errorMessage);
};

// Common schema patterns for reuse
export const CommonSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  nonEmptyString: z.string().min(1),
  positiveNumber: z.number().positive(),
  timestamp: z.string().datetime(),
};

// Example usage - defining a schema for a business entity
export const exampleBusinessSchema = z.object({
  id: CommonSchemas.uuid,
  name: CommonSchemas.nonEmptyString,
  description: CommonSchemas.nonEmptyString,
  category: CommonSchemas.nonEmptyString,
  location: z.string().optional(),
  contact: z.string().optional(),
  // Add more fields as needed
});
