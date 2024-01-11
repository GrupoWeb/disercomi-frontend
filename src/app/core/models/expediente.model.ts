
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
  nombreEstado: string;
  nombreUsuario: string;
  nombreTipoExpediente: string;
  nitUsuario: string;
  representanteLegal: string;
  clasificacionEconomica: string;
  idEstado: string;
  idTipoExpediente: string;
  idUsuario: number;
  usuarioAsignacion: number;
  dictamenFirmado: boolean;
  dictamenGenerado: boolean;
  providenciaFirmada: boolean;
  providenciaGenerada: boolean;
  resolucionGenerada: boolean;
  idItem: string;


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
    this.idTipoExpediente = expedienteModel.idTipoExpediente;
    this.idUsuario = expedienteModel.idUsuario;
    this.usuarioAsignacion = expedienteModel.usuarioAsignacion;
    this.nombreEstado = expedienteModel.nombreEstado;
    this.nombreUsuario = expedienteModel.nombreUsuario;
    this.nombreTipoExpediente = expedienteModel.nombreTipoExpediente;
    this.nitUsuario = expedienteModel.nitUsuario;
    this.dictamenFirmado = expedienteModel.dictamenFirmado;
    this.dictamenGenerado = expedienteModel.dictamenGenerado;
    this.providenciaFirmada = expedienteModel.providenciaFirmada;
    this.providenciaGenerada = expedienteModel.providenciaGenerada;
    this.resolucionGenerada = expedienteModel.resolucionGenerada;
    this.idItem = expedienteModel.idItem;
  }
}
