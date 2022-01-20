import { Router, Request, Response } from "express";
import { CustomError } from "../error/custom-error";
import { calculusService } from "../services/calculus-service";
import { parseService } from "../services/parse-service";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const { query } = req.query;
    if (query === null || query === undefined || query.length === 0) {
        res.status(400).send({ message: "query cannot be null" });
        return;
    }

    const tokensArray = parseService.parseString(query as string);
    if (tokensArray === null || tokensArray === undefined || !Array.isArray(tokensArray) || tokensArray.length <= 0) {
        throw new CustomError(400, "Invalid query.");
    }

    const postfixArray = calculusService.createPostfixArray(tokensArray);
    if (postfixArray === null || postfixArray === undefined || !Array.isArray(postfixArray) || postfixArray.length <= 0) {
        throw new CustomError(400, "Invalid query.");
    }

    const result = calculusService.evaluatePostfix(postfixArray);
    res.status(200).send({ result });
});

export { router as calculusRouter };