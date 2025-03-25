
import { toast } from "sonner";
import { z } from "zod";

export const validateRequest = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  errorMessage = 'Invalid request data'
): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => issue.message).join(", ");
      toast.error(`${errorMessage}: ${issues}`);
    } else {
      toast.error(errorMessage);
    }
    return null;
  }
};
