import { Request, Response } from "express";
import { createSupplier, deleteSupplier, getSupplierById, getSuppliers, updateSupplier } from "./indexs";
import { SupplierInfoMapper } from "./indext";

export const handleGetSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await getSuppliers(); // no req needed
    res.json({
      status: 200,
      rows: suppliers
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Get supplier by ID ===

export const handleGetSupplierById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const supplier = await getSupplierById(id); // req.params.id needed
    if(!supplier){
        return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({
      rows: supplier
    });
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Create supplier ===

export const handleCreateSupplier = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const mappedData = SupplierInfoMapper(data);
    const rows: any = await createSupplier(mappedData); // req.body needed
    if(!rows){
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//=== Update supplier ===

export const handleUpdateSupplier = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body as any;
    const mappedData = SupplierInfoMapper(data);
    const rows: any = await updateSupplier(id, mappedData); // req.body needed
    if(!rows){
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Delete supplier ===

export const handleDeleteSupplier = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const rows: any = await deleteSupplier(id); // req.params.id needed
    if(!rows){
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
