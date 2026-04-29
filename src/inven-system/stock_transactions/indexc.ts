import { Request, Response } from "express";
import { getStockTransactions,getStockTransactionById,createStockTransaction,updateStockTransaction,deleteStockTransaction,} from "./indexs";

// === Get all transactions ===
export const handleGetStockTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await getStockTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching stock transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// === Get transaction by ID ===
export const handleGetStockTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await getStockTransactionById(Number(id));

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// === Create transaction (IN / OUT) ===
export const handleCreateStockTransaction = async (req: Request, res: Response) => {
  try {
    const { product_id, transaction_type, quantity, transaction_date, reference_no, remarks } = req.body;

    if (!product_id || !transaction_type || !quantity || !transaction_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const insertId = await createStockTransaction({
      product_id,
      transaction_type,
      quantity,
      transaction_date,
      reference_no,
      remarks,
    });

    res.status(201).json({
      message: "Stock transaction recorded successfully",
      transaction_id: insertId,
    });
  } catch (error) {
    console.error("Error creating stock transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// === Update transaction ===
export const handleUpdateStockTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { product_id, transaction_type, quantity, transaction_date, reference_no, remarks } = req.body;

    const existing = await getStockTransactionById(Number(id));
    if (!existing) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await updateStockTransaction(Number(id), {
      product_id,
      transaction_type,
      quantity,
      transaction_date,
      reference_no,
      remarks,
    });

    res.status(200).json({ message: "Stock transaction updated successfully" });
  } catch (error) {
    console.error("Error updating stock transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// === Delete transaction ===
export const handleDeleteStockTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await getStockTransactionById(Number(id));

    if (!existing) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await deleteStockTransaction(Number(id));
    res.status(200).json({ message: "Stock transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
