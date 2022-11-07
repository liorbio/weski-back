import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import publicRoutes from "./routes/public_routes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

publicRoutes(app);

export default app;
