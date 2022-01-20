import { Request, Response, NextFunction } from "express";
import { CustomError, ErrorModel, ErrorResponse } from "./custom-error";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        const error = err as CustomError;
        return res.status(error.statusCode).send(error.serializeErrors());
    }

    const errorList: Array<ErrorModel> = [];
    errorList.push({
        message: err.message
    });

    return res.status(500).send(new ErrorResponse(errorList));
}

export { errorHandler };
