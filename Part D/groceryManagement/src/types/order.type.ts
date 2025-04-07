export interface IOrderItem {
    goodId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  }
  
  export type OrderStatus = 'invited' | 'in process' | 'completed';
  
  export interface IOrder {
    _id?: string;
    supplierId: string;
    items: IOrderItem[];
    status: OrderStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }
  