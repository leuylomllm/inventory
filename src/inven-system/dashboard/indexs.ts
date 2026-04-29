import db from "../../config/db";

export const getDashboardSum = async () => {
  try {
    // 1️⃣ Totals
    const [totalRows]: any = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM tbl_products WHERE isDeleted = 0) AS totalProduct,
        (SELECT COALESCE(SUM(stock),0) FROM tbl_products WHERE isDeleted = 0) AS totalStock,
        (SELECT COUNT(*) FROM tbl_stock_transactions WHERE DATE(created_at) = CURDATE()) AS OrdersToday,
        (
          SELECT COALESCE(SUM(o.quantity * p.price),0)
          FROM tbl_stock_transactions o
          JOIN tbl_products p ON p.id = o.product_id
          WHERE DATE(o.created_at) = CURDATE()
        ) AS revenue
    `);

    const totals = totalRows && totalRows[0] ? totalRows[0] : {
      totalProduct: 0,
      totalStock: 0,
      OrdersToday: 0,
      revenue: 0,
    };

    // 2️⃣ Out of stock (stock <= 0)
    const [outOfStock]: any = await db.query(`
      SELECT p.id, p.product_name AS name, p.stock, c.category_name
      FROM tbl_products p
      LEFT JOIN tbl_categories c ON c.id = p.category_id
      WHERE p.isDeleted = 0 AND p.stock <= 0
      ORDER BY p.product_name ASC
    `);

    // 3️⃣ Low stock (stock > 0 && stock <= 3)
    const [lowStock]: any = await db.query(`
      SELECT p.id, p.product_name AS name, p.stock, c.category_name
      FROM tbl_products p
      LEFT JOIN tbl_categories c ON c.id = p.category_id
      WHERE p.isDeleted = 0 AND p.stock > 0 AND p.stock <= 3
      ORDER BY p.stock ASC, p.product_name ASC
    `);

    // 4️⃣ Top product all-time by units sold
    const [topRows]: any = await db.query(`
      SELECT 
        p.product_name AS name,
        c.category_name AS category_name,
        COALESCE(SUM(o.quantity),0) AS units
      FROM tbl_stock_transactions o
      JOIN tbl_products p ON p.id = o.product_id
      LEFT JOIN tbl_categories c ON c.id = p.category_id
      GROUP BY o.product_id, p.product_name, c.category_name
      ORDER BY units DESC
      LIMIT 1
    `);

    const top = topRows && topRows[0] ? topRows[0] : null;

    // 5️⃣ Highest stock product
    const [highestStockRows]: any = await db.query(`
      SELECT p.product_name AS name, c.category_name, p.stock
      FROM tbl_products p
      LEFT JOIN tbl_categories c ON c.id = p.category_id
      WHERE p.isDeleted = 0
      ORDER BY p.stock DESC
      LIMIT 1
    `);
    const highestStock = highestStockRows && highestStockRows[0] ? highestStockRows[0] : null;

    // Dashboard object
    const dashboard = {
      totalProduct: Number(totals.totalProduct) || 0,
      totalStock: Number(totals.totalStock) || 0,
      OrdersToday: Number(totals.OrdersToday) || 0,
      revenue: Number(totals.revenue) || 0,
      outOfStock,
      lowStock,
      topProduct: top ? top.name : null,
      topCategory: top ? top.category_name : null,
      topProductUnits: top ? Number(top.units) : null,
      highestStockProduct: highestStock ? highestStock.name : null,
      highestStockCategory: highestStock ? highestStock.category_name : null,
      highestStock: highestStock ? Number(highestStock.stock) : null,
    };

    return dashboard;
  } catch (error) {
    console.error("getDashboardSum error:", error);
    return { error };
  }
};
