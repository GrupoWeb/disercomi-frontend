export class IncisosModel {
  idIncisoArancelario: string;
  nombre: string;


  constructor(incisosModel: IncisosModel) {
    this.idIncisoArancelario = incisosModel.idIncisoArancelario;
    this.nombre = incisosModel.nombre;
  }
}
