export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      message: error.message,
      success: false,
    };
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error);
  return {
    status: 500,
    message: 'An unexpected error occurred',
    success: false,
  };
};

export const errorTypes = {
  BAD_REQUEST: (message = 'Bad request') => new ApiError(400, message),
  UNAUTHORIZED: (message = 'Unauthorized') => new ApiError(401, message),
  FORBIDDEN: (message = 'Forbidden') => new ApiError(403, message),
  NOT_FOUND: (message = 'Resource not found') => new ApiError(404, message),
  CONFLICT: (message = 'Resource conflict') => new ApiError(409, message),
  VALIDATION_ERROR: (message = 'Validation failed') => new ApiError(422, message),
  INTERNAL_ERROR: (message = 'Internal server error') => 
    new ApiError(500, message, false),
};
