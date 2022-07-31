import { useState } from 'react';
import { SupplierExpensesValuesProps } from '../children/BasicListing/SupplierExpenses';

interface useBasicListingProps {
  marketPlaceChangeHandler: (id: number, key: string, value: any) => void;
  supplierExpensesHandler: (values: SupplierExpensesValuesProps) => void;
}

export const useBasicListing = (): useBasicListingProps => {
  // state to manage the fields

  const marketPlaceChangeHandler = (id: number, key: string, value: any) => {
    // TODO; update the marketplace somehow
  };

  const supplierExpensesHandler = (values: SupplierExpensesValuesProps) => {
    console.log('I have called with ', values);
  };

  return { marketPlaceChangeHandler, supplierExpensesHandler };
};
