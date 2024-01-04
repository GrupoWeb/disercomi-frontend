
export class ExpedienteModel {
  idExpediente: number;
  fechaHoraAdicion: string;
  fechaHoraModificacion: string;
  usuarioAdicion: string;
  usuarioModificacion:string;
  actividadEconomica: string;
  areaAsignada: string;
  domicilioFiscal: string;
  nombreEmpresa: string;
  representanteLegal: string;
  clasificacionEconomica: string;
  idEstado: string;
  idtipoExpediente: string;
  idUsuario: number;
  usuarioAsignacion: number;


  constructor(expedienteModel: ExpedienteModel) {
    this.idExpediente = expedienteModel.idExpediente;
    this.fechaHoraAdicion = expedienteModel.fechaHoraAdicion;
    this.fechaHoraModificacion = expedienteModel.fechaHoraModificacion;
    this.usuarioAdicion = expedienteModel.usuarioAdicion;
    this.usuarioModificacion = expedienteModel.usuarioModificacion;
    this.actividadEconomica = expedienteModel.actividadEconomica;
    this.areaAsignada = expedienteModel.areaAsignada;
    this.domicilioFiscal = expedienteModel.domicilioFiscal;
    this.nombreEmpresa = expedienteModel.nombreEmpresa;
    this.representanteLegal = expedienteModel.representanteLegal;
    this.clasificacionEconomica = expedienteModel.clasificacionEconomica;
    this.idEstado = expedienteModel.idEstado;
    this.idtipoExpediente = expedienteModel.idtipoExpediente;
    this.idUsuario = expedienteModel.idUsuario;
    this.usuarioAsignacion = expedienteModel.usuarioAsignacion;
  }
}
