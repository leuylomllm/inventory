
export interface Supplier {
    id: number;
    supplier_name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    created_at: Date;
  }
  
  
export function SupplierInfoMapper(supplier: Supplier): Supplier {
    return {

        //
        id: supplier.id,
        supplier_name: supplier.supplier_name,
        contact_name: supplier.contact_name,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        created_at: supplier.created_at,
    };
}
