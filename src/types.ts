export interface Transaction {
  id?: string;
  date: string; // ISO string
  fullName: string;
  incomeLAK: number;
  incomeTHB: number;
  expenseLAK: number;
  expenseTHB: number;
  detailsLAK: string;
  detailsTHB: string;
  note: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export interface Summary {
  totalIncomeLAK: number;
  totalIncomeTHB: number;
  totalExpenseLAK: number;
  totalExpenseTHB: number;
  balanceLAK: number;
  balanceTHB: number;
}
