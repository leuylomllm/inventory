import { Router } from "express";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProductById,
  handleGetProducts,
  handleLoadFormProduct,
  handleUpdateProduct,
} from "./products/indexc";
import {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetCategoryById,
  handleUpdateCategory,
  handleGetCategories,
} from "./categories/indexc";
import {
  handleGetStockTransactions,
  handleGetStockTransactionById,
  handleCreateStockTransaction,
  handleUpdateStockTransaction,
  handleDeleteStockTransaction,
} from "./stock_transactions/indexc";
import {
  handleGetSuppliers,
  handleGetSupplierById,
  handleCreateSupplier,
  handleUpdateSupplier,
  handleDeleteSupplier,
} from "./suppliers/indexc";
import { handleGetDashbordSum } from "./dashboard/indexc";
import { handleLogin, handleRegister } from "./auth/index";
import authMiddleware from "../middleware/authMiddleware";
import {
  handleCreateUser,
  handleDeleteUser,
  handleFormLoadUser,
  handleGetProfile,
  handleGetUserById,
  handleGetUsers,
  handleUpdateProfile,
  handleUpdateUser,
} from "./users/indexc";
import { createNewOrder, deleteOrderById, getAllOrders } from "./orders/indexc";
import { getUserProfile, updateUserProfile } from "./profile/indexc";
const router = Router();

//=== Product Routes === //
router.get("/webinven/data/product/list", authMiddleware, handleGetProducts);
router.get(
  "/webinven/data/product/view/:id",
  authMiddleware,
  handleGetProductById
);
router.post("/webinven/data/product", authMiddleware, handleCreateProduct);
router.put("/webinven/data/product/:id", authMiddleware, handleUpdateProduct);
router.delete(
  "/webinven/data/product/delete/:id",
  authMiddleware,
  handleDeleteProduct
);
router.post(
  "/webinven/data/product/formload",
  authMiddleware,
  handleLoadFormProduct
);

//=== Category Routes ===

router.get("/webinven/data/category/list", authMiddleware, handleGetCategories);
router.get(
  "/webinven/data/category/view/:id",
  authMiddleware,
  handleGetCategoryById
);
router.post("/webinven/data/category", authMiddleware, handleCreateCategory);
router.put("/webinven/data/category/:id", authMiddleware, handleUpdateCategory);
router.delete(
  "/webinven/data/category/delete/:id",
  authMiddleware,
  handleDeleteCategory
);

//=== Supplier Routes ===

router.get("/webinven/data/supplier/list", authMiddleware, handleGetSuppliers);
router.get(
  "/webinven/data/supplier/view/:id",
  authMiddleware,
  handleGetSupplierById
);
router.post("/webinven/data/supplier", authMiddleware, handleCreateSupplier);
router.put("/webinven/data/supplier/:id", authMiddleware, handleUpdateSupplier);
router.delete(
  "/webinven/data/supplier/delete/:id",
  authMiddleware,
  handleDeleteSupplier
);

//=== Stock Transaction Routes ===

router.get(
  "/webinven/data/stock-transaction/list",
  authMiddleware,
  handleGetStockTransactions
);
router.get(
  "/webinven/data/stock-transaction/view/:id",
  authMiddleware,
  handleGetStockTransactionById
);
router.post(
  "/webinven/data/stock-transaction",
  authMiddleware,
  handleCreateStockTransaction
);
router.put(
  "/webinven/data/stock-transaction/:id",
  authMiddleware,
  handleUpdateStockTransaction
);
router.delete(
  "/webinven/data/stock-transaction/delete/:id",
  authMiddleware,
  handleDeleteStockTransaction
);

//=== Dashboard Routes ===

router.get("/webinven/data/dashboard", authMiddleware, handleGetDashbordSum);

//=== Auth Routes ===

router.post("/webinven/data/auth/login", handleLogin);
router.post("/webinven/data/auth/register", handleRegister);

//=== User Routes ===

// router.get("/webinven/data/user/list", authMiddleware, handleGetUsers);

// router.get("/webinven/data/user/view/:id", authMiddleware, handleGetUserById);

// router.post("/webinven/data/user", authMiddleware, handleCreateUser);
// router.put("/webinven/data/user/:id", authMiddleware, handleUpdateUser);
// router.delete(
//   "/webinven/data/user/delete/:id",
//   authMiddleware,
//   handleDeleteUser
// );
// ===== User Management Routes =====

// Get all users
router.get("/webinven/data/user/list", authMiddleware, handleGetUsers);

// Get user by ID
router.get("/webinven/data/user/view/:id", authMiddleware, handleGetUserById);

// Create new user
router.post("/webinven/data/user", authMiddleware, handleCreateUser);

// Update user by ID
router.put("/webinven/data/user/:id", authMiddleware, handleUpdateUser);

// Delete user
router.delete("/webinven/data/user/delete/:id", authMiddleware, handleDeleteUser);

// Form load (e.g., role dropdowns)
router.post("/webinven/data/user/formload", authMiddleware, handleFormLoadUser);

// ===== Profile Routes (for logged-in user) =====

router.get("/webinven/data/user/profile", authMiddleware, handleGetProfile);
router.put("/webinven/data/user/profile/:id", authMiddleware, handleUpdateProfile);


router.post("/webinven/data/user/formload", authMiddleware, handleFormLoadUser);

//=== Order Routes ===

router.get("/webinven/data/order/list", authMiddleware, getAllOrders);
router.post("/webinven/data/order", authMiddleware, createNewOrder);
router.delete("/webinven/data/order/delete/:id", authMiddleware, deleteOrderById);


export default router;
