import db from "../../config/db";
import { Supplier } from "./indext";

export const getSuppliers = async () : Promise<Supplier[]> => {
    const [rows] = await db.query("SELECT * FROM tbl_suppliers");
    return rows as Supplier[];
};


//=== Get supplier by ID === 

export const getSupplierById = async (id: number) : Promise<Supplier | null> => {
    const [rows]: any = await db.query("SELECT * FROM tbl_suppliers WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] as Supplier : null;
};

//=== Create supplier ==

export const createSupplier = async (supplier: Omit<Supplier, "id" | "created_at">): Promise<void> => {
    const { supplier_name, contact_name, phone, email, address } = supplier;
    const [rows]: any = await db.query("INSERT INTO tbl_suppliers (supplier_name, contact_name, phone, email, address) VALUES (?, ?, ?, ?, ?)",
      [supplier_name, contact_name, phone, email, address]
    );
    return rows;
};

//=== Update supplier ===

export const updateSupplier = async (id: number, supplier: Omit<Supplier, "id" | "created_at">): Promise<void> => {
    const { supplier_name, contact_name, phone, email, address } = supplier;
    const [rows]: any = await db.query("UPDATE tbl_suppliers SET supplier_name = ?, contact_name = ?, phone = ?, email = ?, address = ? WHERE id = ?",
      [supplier_name, contact_name, phone, email, address, id]
    );
    return rows;
};


//=== Delete supplier ===

export const deleteSupplier = async (id: number): Promise<void> => {
    const [rows]: any = await db.query("DELETE FROM tbl_suppliers WHERE id = ?", [id]);
    return rows;
};

