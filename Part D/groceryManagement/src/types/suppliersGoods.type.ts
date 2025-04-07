export interface ISuppliersGoods {
    _id?: string;
    supplierId: string;
    goodId: string;
    pricePerUnit: number;
    minOrderQuantity: number;
  }