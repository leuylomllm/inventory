import { Request, Response } from "express";
import * as orderService from "./indexs";

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { role_name, id: user_id } = user;

    const orders = await orderService.getOrders(role_name, user_id);
    res.json({ status: "success", rows: orders });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch orders" });
  }
};

// Create new order
export const createNewOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { product_id, quantity, note } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Missing product_id or quantity" });
    }

    const insertId = await orderService.createOrder({
      product_id,
      customer_id: user.id,
      type: "Online",
      quantity: Number(quantity),
      note: note || "",
    });

    res.json({ status: "success", id: insertId });
  } catch (error: any) {
    const message = error.message || "Failed to create order";
    res.status(400).json({ status: "error", message });
  }
};

// Delete order by ID
export const deleteOrderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = await orderService.deleteOrder(id);

    if (!success) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ status: "success", message: "Order deleted" });
  } catch (error) {
    console.error("deleteOrderById error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};
