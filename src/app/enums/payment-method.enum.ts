export enum PaymentMethodEnum {
  'CASH' = 'Gotówka',
  'CREDIT_CARD' = 'Karta kredytowa',
  'DEBIT_CARD' = 'Karta debetowa',
  'BANK_TRANSFER' = 'Przelew bankowy',
  'BLIK' = 'BLIK',
  'PAYPAL' = 'PayPal'
}

export type Payment = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'BLIK' | 'PAYPAL';
