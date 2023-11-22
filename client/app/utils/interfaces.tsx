export interface entryType {
  _id: string;
  date: string;
  description: string;
  category: string;
  income?: number;
  debits?: number;
}

export interface modalEntryType {
  date: string;
  description: string;
  category: string;
  income?: number;
  debits?: number;
}