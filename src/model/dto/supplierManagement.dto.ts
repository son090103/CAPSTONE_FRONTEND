export interface GetSupplierResponse {
  id: number;
  name: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export interface CreateSupplierRequest {
 name: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export interface UpdateSupplierRequest  {
  name: string;
  phone: string;
  address: string;
  is_active: boolean;
}