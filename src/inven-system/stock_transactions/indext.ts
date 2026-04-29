
export interface StockTransaction {
    id: number;
    product_id: number;
    transaction_type: "IN" | "OUT";
    quantity: number;
    transaction_date: Date;
    reference_no?: string;
    remarks?: string;
    created_at: Date;
  }
  
  
export function StockTransactionInfoMapper(stockTransaction: StockTransaction): StockTransaction {
    return {

        //
        id: stockTransaction.id,
        product_id: stockTransaction.product_id,
        transaction_type: stockTransaction.transaction_type,
        quantity: stockTransaction.quantity,
        transaction_date: stockTransaction.transaction_date,
        reference_no: stockTransaction.reference_no,
        remarks: stockTransaction.remarks,
        created_at: stockTransaction.created_at,
    };
}
