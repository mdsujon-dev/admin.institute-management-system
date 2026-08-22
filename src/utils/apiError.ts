import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ApiErrorResponse } from "../types/api";

/**
 * Anything a failed request can hand back: an RTK Query error object from a
 * hook, or the `unknown` a `catch` block gives you. Both go through the same
 * narrowing here so no call site has to cast.
 */
type QueryError = unknown;

function isFetchError(error: QueryError): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

function isSerializedError(error: QueryError): error is { message?: string } {
  return typeof error === "object" && error !== null && "message" in error;
}

function isApiErrorBody(body: unknown): body is ApiErrorResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
  );
}

/**
 * Turns any failure into one sentence worth showing a person. The backend
 * already speaks in full sentences, so its `message` is preferred over anything
 * invented here.
 */
export function getErrorMessage(
  error: QueryError,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) {
    return fallback;
  }

  if (!isFetchError(error)) {
    return (isSerializedError(error) && error.message) || fallback;
  }

  if (error.status === "FETCH_ERROR") {
    return "Cannot reach the server. Check that the API is running.";
  }

  if (error.status === "TIMEOUT_ERROR") {
    return "The server took too long to respond. Please try again.";
  }

  if (error.status === "PARSING_ERROR" || error.status === "CUSTOM_ERROR") {
    return error.error || fallback;
  }

  // The rate limiter answers with a framework message that means nothing to an
  // operator; sign in is throttled hard on purpose, so say what to do instead.
  if (error.status === 429) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  return isApiErrorBody(error.data) ? error.data.message : fallback;
}

/**
 * Field level validation failures, as the backend returns them: an array of
 * constraint sentences like `"email must be an email"`. Mapped to the field they
 * belong to, so a form can show each one under its own input.
 */
export function getFieldErrors(error: QueryError): Record<string, string> {
  if (!isFetchError(error) || !isApiErrorBody(error.data)) {
    return {};
  }

  const { errors } = error.data;

  if (!Array.isArray(errors)) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const entry of errors) {
    if (typeof entry !== "string") {
      continue;
    }

    // class-validator starts every message with the property name.
    const field = entry.split(" ")[0];

    if (field && !result[field]) {
      result[field] = entry.charAt(0).toUpperCase() + entry.slice(1);
    }
  }

  return result;
}

/** HTTP status of a failed request, when there is one. */
export function getErrorStatus(error: QueryError): number | undefined {
  return isFetchError(error) && typeof error.status === "number"
    ? error.status
    : undefined;
}
