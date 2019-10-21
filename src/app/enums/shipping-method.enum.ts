export enum ShippingMethodEnum {
  'COLLECTION_IN_PERSON' = 'Odbiór osobisty',
  'CASH_ON_DELIVERY' = 'Przesyłka kurierska (za pobraniem)',
  'COURIER_PREPAYMENT' = 'Przesyłka kurierska (przedpłata)',
  'POCZTA_POLSKA' = 'Poczta Polska',
  'PACZKOMATY_INPOST' = 'Paczkomaty InPost'
}

export type Shipping =
  'COLLECTION_IN_PERSON'
  | 'CASH_ON_DELIVERY'
  | 'COURIER_PREPAYMENT'
  | 'POCZTA_POLSKA'
  | 'PACZKOMATY_INPOST';
