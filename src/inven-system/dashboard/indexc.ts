import { getDashboardSum } from "./indexs";
import { Request, Response } from "express";

export const handleGetDashbordSum = async (req: Request, res: Response) => {
    try {
        const summary = await getDashboardSum();
        res.status(200).json({
            success: true,
            rows: summary,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch dashboard summary"
        });
    }
}
