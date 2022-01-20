import { ValidationError } from "express-validator";

class CustomError extends Error {
    statusCode: number;
    private errorList: Array<ErrorModel>;

    constructor(statusCode: number, message?: string, public errors?: ValidationError[]) {
        super(message);
        this.statusCode = statusCode;
        this.errorList = [];
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors(): ErrorResponse {
        if (this.errors) {
            this.errors.forEach(e => this.errorList.push({
                message: e.msg,
            }));
        } else if (this.message) {
            this.errorList.push({
                message: this.message
            });
        } else {
            this.errorList.push({
                message: "Unexpected Error!!"
            });
        }

        return new ErrorResponse(this.errorList);
    }
}

class ErrorResponse {
    errors: Array<ErrorModel>

    constructor(errors: Array<ErrorModel>) {
        this.errors = errors;
    }
}

interface ErrorModel {
    message: string
}

export { CustomError, ErrorResponse, ErrorModel };