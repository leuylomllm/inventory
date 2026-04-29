import { Application } from "express";
import inventRoute from "../inven-system/invenRoute";

export async function registerRoutes(app: Application) {
    app.use("/v1/api", inventRoute);
}


