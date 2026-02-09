
export enum MovementType {
  ENTRY = 'ENTRADA',
  EXIT = 'SAÍDA'
}

export interface Supplier {
  id: number;
  nome: string;
  contacto: string;
  email: string;
  endereco?: string;
}

export interface Medication {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  batch: string;
  expiryDate: string;
  supplierId?: number;
  supplier_name?: string;
  price: number;
}

export interface Movement {
  id: number;
  medicationId: number;
  medicationName: string;
  type: MovementType;
  quantity: number;
  date: string;
  reason: string;
}

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
}
