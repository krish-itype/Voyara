import { ZodError } from "zod";

export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: `Route ${request.method} ${request.originalUrl} was not found`,
  });
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      success: false,
      message: "Please correct the highlighted fields",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error.code === "P2002") {
    return response.status(409).json({
      success: false,
      message: "An account with that email already exists",
    });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong on the server" : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  return response.status(statusCode).json({
    success: false,
    message,
    ...(error.details ? { details: error.details } : {}),
  });
}

