import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interface/errors";
import { IGenericErrorResponse } from "../interface/common";

const handleValidateError = (
  err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(el => {
    return { message: el?.message, path: el?.path };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation error",
    errorsMessages: errors,
  };
};
export default handleValidateError;
