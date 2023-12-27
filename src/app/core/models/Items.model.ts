export class ItemsModel {
  idItem: string;
  valor: string;
  descripcion: string;
  idCatalogo: string;


  constructor(itemsModel: ItemsModel) {
    this.idItem = itemsModel.idItem;
    this.valor = itemsModel.valor;
    this.descripcion = itemsModel.descripcion;
    this.idCatalogo = itemsModel.idCatalogo;
  }
}
