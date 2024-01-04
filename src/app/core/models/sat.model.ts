export interface Representantes {
  nit: string;
  nombre: string;
}

export class SatModel {
  nit!: string;
  nombreEmpresa!: string;
  entidadAdministradora!: string;
  correoNotificacion!: string;
  direccion!: string;
  zona!: string;
  municipio!: string;
  departamento!: string;
  codigoPostal!: string;
  telefono!: string;
  representantesLegales!: Representantes[];
  tipoContribuyente!: string


  constructor(satModel: SatModel) {
    this.nit = satModel.nit;
    this.nombreEmpresa = satModel.nombreEmpresa;
    this.entidadAdministradora = satModel.entidadAdministradora;
    this.correoNotificacion = satModel.correoNotificacion;
    this.direccion = satModel.direccion;
    this.zona = satModel.zona;
    this.municipio = satModel.municipio;
    this.departamento = satModel.departamento;
    this.codigoPostal = satModel.codigoPostal;
    this.telefono = satModel.telefono;
    this.representantesLegales = satModel.representantesLegales;
    this.tipoContribuyente = satModel.tipoContribuyente;
  }
}
