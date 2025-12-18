export interface Livraison {
  _id?: string;
  commandId: string;
  deliveryDate: Date;
  deliveryPerson: string;
  paymentMode: string;
  status: 'en attente' | 'en cours' | 'livrée' | 'annulée';
  delivererId: string;
  clientName?: string;
  commandeDate?: Date;
}
