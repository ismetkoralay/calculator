import express from "express";
import { calculusRouter } from "./src/routes/calculus-routes";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./src/error/error-handler";
import 'express-async-errors';

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use("/calculus", calculusRouter);
app.use(errorHandler);

export { app };