import { Request, Response } from "express";
import { createCategory, deleteCategory, getCategoryById, getCategories, updateCategory } from "./indexs";
import { CategoryInfoMapper } from "./indext";

export const handleGetCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories(); // no req needed
    res.json({
      status: 200,
      rows: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Get Category by ID ===

export const handleGetCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await getCategoryById(id); // req.params.id needed
    if(!product){
        return res.status(404).json({ message: "Category not found" });
    }
    res.json({
      rows: product
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Create Category ===

export const handleCreateCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const mappedData = CategoryInfoMapper(data);
    const rows: any = await createCategory(mappedData); // req.body needed
    if(!rows){
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//=== Update Category ===

export const handleUpdateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body as any;
    const mappedData = CategoryInfoMapper(data);
    const rows: any = await updateCategory(id, mappedData); // req.body needed
    if(!rows){
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Delete Category ===

export const handleDeleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const rows: any = await deleteCategory(id); // req.params.id needed
    if(!rows){
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
