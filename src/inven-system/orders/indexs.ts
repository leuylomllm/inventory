import db from "../../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Order {
  id: number;
  product_id: number;
  customer_id: number;
  type: string;
  quantity: number;
  note?: string;
  created_at: string;
  product_name?: string;
  username?: string;
}

// Get all orders
export const getOrders = async (role_name: string, user_id: number): Promise<Order[]> => {
  let query = `
    SELECT 
      o.*, 
      p.product_name, 
      p.price, 
      c.category_name,
      u.username,
      (o.quantity * p.price) AS total
    FROM tbl_stock_transactions o
    JOIN tbl_products p ON o.product_id = p.id
    JOIN tbl_categories c ON p.category_id = c.id
    JOIN tbl_users u ON o.customer_id = u.id
  `;

  const params: any[] = [];
  if (role_name === "customer") {
    query += " WHERE o.customer_id = ?";
    params.push(user_id);
  }

  query += " ORDER BY o.created_at DESC";

  const [rows] = await db.query<RowDataPacket[]>(query, params);
  return rows as Order[];
};

// Create new order with stock check
export const createOrder = async (order: Omit<Order, "id" | "created_at">) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1️⃣ Lock product row
    const [rows]: any = await conn.query(
      "SELECT stock FROM tbl_products WHERE id = ? FOR UPDATE",
      [order.product_id]
    );

    if (!rows[0]) throw new Error("Product not found");
    const stock = rows[0].stock;

    // 2️⃣ Check stock
    if (order.quantity > stock) {
      throw new Error(`Cannot order ${order.quantity} units. Only ${stock} available.`);
    }

    // 3️⃣ Insert order
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO tbl_stock_transactions (product_id, customer_id, type, quantity, note, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        order.product_id,
        order.customer_id,
        order.type || "Online",
        order.quantity,
        order.note || "",
      ]
    );

    // 4️⃣ Reduce stock
    await conn.query("UPDATE tbl_products SET stock = stock - ? WHERE id = ?", [
      order.quantity,
      order.product_id,
    ]);

    await conn.commit();
    return result.insertId;
  } catch (err) {
    await conn.rollback();
    console.error("createOrder DB error:", err);
    throw err;
  } finally {
    conn.release();
  }
};

// Delete order
export const deleteOrder = async (id: number) => {
  const [result] = await db.query<ResultSetHeader>(
    `DELETE FROM tbl_stock_transactions WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};
