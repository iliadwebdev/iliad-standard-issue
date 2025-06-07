import { SuccessResponse } from "../internal_utility/SuccessResponse";
import { NetworkError } from "../internal_utility/NetworkError";
import { XOR } from "./logical";

// DATA PROCESSING UTILITY TYPES
// =============================

// Error response is useful for handling guaranteed error responses.
export type ErrorResponse<E = { message: string; code: number }> = {
  data: undefined;
  error: E;
};

export type StandardResponse<T, E = NetworkError> = XOR<
  SuccessResponse<T>,
  ErrorResponse<E>
>;
