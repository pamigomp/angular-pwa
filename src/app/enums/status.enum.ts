export enum StatusEnum {
  'PENDING_PAYMENT' = 'Oczekujące na płatność',
  'PENDING' = 'W trakcie realizacji',
  'PROCESSING' = 'Przetwarzanie zamówienia',
  'PENDING_SHIPMENT' = 'Oczekuje na wysyłkę',
  'SEND' = 'Zamówienie wysłane',
  'SHIPPED' = 'Przesyłka dostarczona',
  'COMPLETED' = 'Zamówienie zrealizowane',
  'CANCELLED' = 'Zamówienie anulowane'
}

export type Status =
  'PENDING_PAYMENT'
  | 'PENDING'
  | 'PROCESSING'
  | 'PENDING_SHIPMENT'
  | 'SEND'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';
