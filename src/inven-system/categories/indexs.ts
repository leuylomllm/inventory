import db from "../../config/db";
import { Category } from "./indext";

export const getCategories = async () : Promise<Category[]> => {
    const [rows] = await db.query("SELECT * FROM tbl_categories");
    return rows as Category[];
};


//=== Get Category by ID ===

export const getCategoryById = async (id: number) : Promise<Category | null> => {
    const [rows]: any = await db.query("SELECT * FROM tbl_categories WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] as Category : null;
};

//=== Create Category ==

export const createCategory = async (category: Omit<Category, "id" | "created_at">): Promise<void> => {
    const { category_name, description } = category;
    const [rows]: any = await db.query("INSERT INTO tbl_categories (category_name, description) VALUES (?, ?)",
      [category_name, description]
    );
    return rows;
};

//=== Update Category ===

export const updateCategory = async (id: number, category: Omit<Category, "id" | "created_at">): Promise<void> => {
    const { category_name, description } = category;
    const [rows]: any = await db.query("UPDATE tbl_categories SET category_name = ?, description = ? WHERE id = ?",
      [category_name, description, id]
    );
    return rows;
};


//=== Delete Category ===

export const deleteCategory = async (id: number): Promise<void> => {
    const [rows]: any = await db.query("DELETE FROM tbl_categories WHERE id = ?", [id]);
    return rows;
};

