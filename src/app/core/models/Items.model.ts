export interface detalles {
  costo: number,
  rol: string,
  moneda: string
}
export class ItemsModel {
  idItem: string;
  valor: string;
  descripcion: string;
  detalle: detalles;
  idCatalogo: string;


  constructor(itemsModel: ItemsModel) {
    this.idItem = itemsModel.idItem;
    this.valor = itemsModel.valor;
    this.descripcion = itemsModel.descripcion;
    this.idCatalogo = itemsModel.idCatalogo;
    this.detalle = itemsModel.detalle;
  }
}
