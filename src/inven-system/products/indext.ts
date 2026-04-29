
export interface Product {
    id: number;
    product_name: string;
    category_id: number;
    supplier_id: number;
    stock: number;
    price: number;
    description: string;
    created_at: Date;
  }
  
export function ProductInfoMapper(product: Product): Product {
    return {

        //
        id: product.id,
        product_name: product.product_name,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        stock: product.stock,
        price: product.price,
        description: product.description,
        created_at: product.created_at,
    };
}
