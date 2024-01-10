export class TrazabilidadModel {
  idTrazabilidad: number;
  idEstado: string;
  nombreEstado: string;
  usuarioAdicion: string;
  fechaHoraAdicion: string;


  constructor(trazabilidadModel: TrazabilidadModel) {
    this.idTrazabilidad = trazabilidadModel.idTrazabilidad;
    this.idEstado = trazabilidadModel.idEstado;
    this.nombreEstado = trazabilidadModel.nombreEstado;
    this.usuarioAdicion = trazabilidadModel.usuarioAdicion;
    this.fechaHoraAdicion = trazabilidadModel.fechaHoraAdicion;
  }
}
