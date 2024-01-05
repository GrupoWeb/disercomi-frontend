export class IncisosModel {
  idIncisoArancelario: string;
  descripcion: string;
  nombre: string;
  cantidad: number;



  constructor(incisosModel: IncisosModel) {
    this.idIncisoArancelario = incisosModel.idIncisoArancelario;
    this.descripcion = incisosModel.descripcion;
    this.nombre = incisosModel.nombre;
    this.cantidad = incisosModel.cantidad;
  }
}
