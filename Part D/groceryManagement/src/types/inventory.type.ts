export interface IInventory {
    _id?: string;
    goodId: string;
    currentQuantity: number;
    minDesiredQuantity: number;
    createdAt?: Date;
    updatedAt?: Date;
  }  