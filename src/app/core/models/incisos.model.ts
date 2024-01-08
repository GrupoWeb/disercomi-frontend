export class IncisosModel {
  idIncisoArancelario: string;
  descripcion: string;
  nombre: string;
  cantidad: number;
  idAnexo: string;
  idTipoAnexo: string;
  descripcionInciso: string
  nombreComercial: string




  constructor(incisosModel: IncisosModel) {
    this.idIncisoArancelario = incisosModel.idIncisoArancelario;
    this.descripcion = incisosModel.descripcion;
    this.nombre = incisosModel.nombre;
    this.cantidad = incisosModel.cantidad;
    this.idAnexo = incisosModel.idAnexo;
    this.idTipoAnexo = incisosModel.idTipoAnexo;
    this.descripcionInciso = incisosModel.descripcionInciso;
    this.nombreComercial = incisosModel.nombreComercial;
  }
}
