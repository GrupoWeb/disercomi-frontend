export class IncisoTemporalModel {
  codigoInciso: number;
  descripcion: string;
  nombreComercial: string;
  cantidad: number;


  constructor(incisoTemporalModel: IncisoTemporalModel) {
    this.codigoInciso = incisoTemporalModel.codigoInciso;
    this.descripcion = incisoTemporalModel.descripcion;
    this.nombreComercial = incisoTemporalModel.nombreComercial;
    this.cantidad = incisoTemporalModel.cantidad;
  }
}
