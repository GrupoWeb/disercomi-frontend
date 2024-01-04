
export class HistorialModel {
  idExpediente!: number;
  fechaHoraAdicion!: string;
  idUsuario!: number;
  nombreUsuario!: string;
  nitUsuario!: string;
  idTipoExpediente!: string;
  nombreTipoExpediente!: string;
  idEstado!: string;
  nombreEstado!: string;


  constructor(historialModel: HistorialModel) {
    this.idExpediente = historialModel.idExpediente || 0;
    this.fechaHoraAdicion = historialModel.fechaHoraAdicion || '';
    this.idUsuario = historialModel.idUsuario || 0;
    this.nombreUsuario = historialModel.nombreUsuario || '';
    this.nitUsuario = historialModel.nitUsuario || '';
    this.idTipoExpediente = historialModel.idTipoExpediente || '';
    this.nombreTipoExpediente = historialModel.nombreTipoExpediente || '';
    this.idEstado = historialModel.idEstado || '';
    this.nombreEstado = historialModel.nombreEstado || '';
  }

}


