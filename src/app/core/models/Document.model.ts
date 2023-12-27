import {ItemsModel} from "@core/models/Items.model";

export class DocumentModel {
  id: number;
  archivo: File;
  documentoCatalogo: ItemsModel;


  constructor(documentModel: DocumentModel) {
    this.id = documentModel.id;
    this.archivo = documentModel.archivo;
    this.documentoCatalogo = documentModel.documentoCatalogo;
  }
}
