import { Request, Response } from "express";
import { createProduct, deleteProduct, formLoadProduct, getProductById, getProducts, updateProduct } from "./indexs";
import { ProductInfoMapper } from "./indext";

export const handleGetProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProducts(); // no req needed
    res.json({
      status: 200,
      rows: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Get Product by ID ===

export const handleGetProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductById(id); // req.params.id needed
    if(!product){
        return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      rows: product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Create Product ===

export const handleCreateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const mappedData = ProductInfoMapper(data);
    const rows: any = await createProduct(mappedData); // req.body needed
    if(!rows){
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//=== Update Product ===

export const handleUpdateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body as any;
    const mappedData = ProductInfoMapper(data);
    const rows: any = await updateProduct(id, mappedData); // req.body needed
    if(!rows){
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Delete Product ===

export const handleDeleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const rows: any = await deleteProduct(id); // req.params.id needed
    if(!rows){
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//=== Load Form Product with supplier and category ===

export const handleLoadFormProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const rows = await formLoadProduct();
        res.json({
            status: 200,
            rows
        });
    } catch (error) {
        console.error("Error loading form product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
