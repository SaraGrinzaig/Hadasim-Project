export interface IGood {
    _id?: string;
    name: string;
    description?: string;
  }  

export interface CreateGoodInput {
    name: string;
    description?: string;
  }
  