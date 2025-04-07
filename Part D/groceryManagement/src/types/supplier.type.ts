export interface ISupplier {
    _id?: string;
    companyName: string;
    representativeName: string;
    phone: string;
    email: string;
    password: string;
    createdAt?: Date;
  }  

export interface GoodInput {
    name: string;
    description?: string;
    pricePerUnit: number;
    minOrderQuantity: number;
  }
  
export interface RegisterSupplierData {
    companyName: string;
    representativeName: string;
    phone: string;
    email: string;
    password: string;
    goods: GoodInput[];
}
  