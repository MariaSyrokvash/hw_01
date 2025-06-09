export interface FieldError {
  message: string | null;
  field: string | null;
}

export interface APIErrorResult {
  errorsMessages: FieldError[] | null;
}
