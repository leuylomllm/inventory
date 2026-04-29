import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { StockTransaction } from "./indext";

//=== Get All Stock Transactions ===
export const getStockTransactions = async (): Promise<StockTransaction[]> => {
  const [rows] = await db.query("SELECT * FROM tbl_stock_transactions ORDER BY id DESC");
  return rows as StockTransaction[];
};

//=== Get Stock Transaction by ID ===
export const getStockTransactionById = async (id: number): Promise<StockTransaction | null> => {
  const [rows]: any = await db.query("SELECT * FROM tbl_stock_transactions WHERE id = ?",[id]
  );
  return rows.length > 0 ? rows[0] as StockTransaction : null;
};

//=== Create Transaction (IN / OUT) ===
export const createStockTransaction = async ( stockTransaction: Omit<StockTransaction, "id" | "created_at">): Promise<number> => {
  const { product_id, transaction_type, quantity, transaction_date, reference_no, remarks } = stockTransaction;

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO tbl_stock_transactions 
      (product_id, transaction_type, quantity, transaction_date, reference_no, remarks) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [product_id, transaction_type, quantity, transaction_date, reference_no, remarks]
  );

  // Auto-update stock quantity
  const sign = transaction_type === "IN" ? "+" : "-";
  await db.query(`UPDATE tbl_products SET quantity = quantity ${sign} ? WHERE id = ?`, [
    quantity,
    product_id,
  ]);

  return result.insertId; // return the new transaction ID
};

//=== Update Stock Transaction ===
export const updateStockTransaction = async (
  id: number,
  stockTransaction: Partial<Omit<StockTransaction, "id" | "created_at">>
): Promise<void> => {
  const { product_id, transaction_type, quantity, transaction_date, reference_no, remarks } = stockTransaction;

  await db.query(
    `UPDATE tbl_stock_transactions 
     SET product_id = ?, transaction_type = ?, quantity = ?, transaction_date = ?, reference_no = ?, remarks = ? 
     WHERE id = ?`,
    [product_id, transaction_type, quantity, transaction_date, reference_no, remarks, id]
  );
};

//=== Delete Stock Transaction ===
export const deleteStockTransaction = async (id: number): Promise<void> => {
  await db.query("DELETE FROM tbl_stock_transactions WHERE id = ?", [id]);
};
