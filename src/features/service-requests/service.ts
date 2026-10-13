import { persistRequest, type RequestRepository } from "./repository";
import { serviceRequestSchema } from "./schema";

export async function createServiceRequest(
  input: unknown,
  save: RequestRepository = persistRequest,
) {
  const validated = serviceRequestSchema.parse(input);
  return save(validated);
}
