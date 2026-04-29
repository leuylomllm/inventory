import db from "../../config/db";
import { Product } from "./indext";

export const getProducts = async (): Promise<any[]> => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.product_name,
      p.category_id,
      p.supplier_id,
      p.stock,
      p.price,
      p.description,
      c.category_name,
      s.supplier_name
    FROM tbl_products p
    LEFT JOIN tbl_categories c ON c.id = p.category_id
    LEFT JOIN tbl_suppliers s ON s.id = p.supplier_id
    WHERE p.isDeleted = 0
    ORDER BY p.product_name ASC
  `);
  return rows as any[];
};


//=== Get product by ID ===

export const getProductById = async (id: number) : Promise<Product | null> => {
    const [rows]: any = await db.query("SELECT * FROM tbl_products WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] as Product : null;
};

//=== Create Product ==

export const createProduct = async (product: Omit<Product, "id" | "created_at">): Promise<void> => {
    const { product_name, category_id, supplier_id, stock, price, description } = product;
    const [rows]: any = await db.query("INSERT INTO tbl_products (product_name, category_id, supplier_id, stock, price, description) VALUES (?, ?, ?, ?, ?, ?)",
      [product_name, category_id, supplier_id, stock, price, description]
    );
    return rows;
};

//=== Update Product ===

export const updateProduct = async (id: number, product: Omit<Product, "id" | "created_at">): Promise<void> => {
    const { product_name, category_id, supplier_id, stock, price, description } = product;
    const [rows]: any = await db.query("UPDATE tbl_products SET product_name = ?, category_id = ?, supplier_id = ?, stock = ?, price = ?, description = ? WHERE id = ?",
      [product_name, category_id, supplier_id, stock, price, description, id]
    );
    return rows;
};


//=== Delete product ===

export const deleteProduct = async (id: number): Promise<void> => {
    const [rows]: any = await db.query("UPDATE tbl_products SET isDeleted = 1 WHERE id = ?", [id]);
    return rows;
};


//=== Form Load Product ===

export const formLoadProduct = async () => {
  const [categories, suppliers] = await Promise.all([
    db.query(`
      SELECT id, category_name 
      FROM tbl_categories
      ORDER BY category_name ASC
    `),
    db.query(`
      SELECT id, supplier_name 
      FROM tbl_suppliers
      
      ORDER BY supplier_name ASC
    `),
  ]);

  return {
    categories: categories[0],
    suppliers: suppliers[0],
  };
};
