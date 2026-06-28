
export interface Parts {
    id: number;
    sku: string,
    name: string,
}
export interface Suppliers {
    id: number;
    name: string,
}
export interface Users{
    fullName: string;
}
export interface ImportSparePartResponse {
    id: number;
    type: string;
    receipt_code: string,
    createdAt: string
    quantity: number;
    unit_price: number;
    manager: Users;
    part: Parts;
    supplier: Suppliers;
}

export interface ConflictPart {
  id: number;
  sku: string;
  name: string;
  brand?: string;
}

export interface ImportSparePartItemRequest {
  quantity: number;
  unit_price: number;
  retail_price?: number;
  part_id?: number;
  name?: string;
  brand?: string;
  category_id?: number;
  warranty_period_months?: number;
  warranty_km_limit?: number;
  force: boolean;
}

export interface ImportSparePartRequest {
  supplier_id: number;
  items: ImportSparePartItemRequest[];
}
