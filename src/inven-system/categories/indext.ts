export interface Category {
    id: number;
    category_name: string;
    description?: string;
    created_at: Date;
  }

  
  export function CategoryInfoMapper(category: Category): Category {
    return {
        //
        id: category.id,
        category_name: category.category_name,
        description: category.description,
        created_at: category.created_at,
    };
}