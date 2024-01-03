export interface RepresentanteLegal {
  nit: string;
  nombre: string;
}
  export class User {
  id!: number;
  img!: string;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  idUsuario!: number;
  nombre!: string;
  correo!: string;
  nit!: string;
  fechaHoraAcceso!: string;
  nombreZonaFranca!: string;
  telefono!: string;
  direccion!: string;
  zona!: string;
  municipio!: string;
  departamento!: string;
  representantesLegales!: RepresentanteLegal[];
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
  idRol!: string;
  activo!: string;
  usuarioAdicion!: string;
  fechaHoraAdicion!: string;
  nombreRol!: string;


  constructor(user: User) {
    this.id = user.id  || 0;
    this.img = user.img || '';
    this.username = user.username || '';
    this.password = user.password || '';
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.token = user.token  || '';
    this.idUsuario = user.idUsuario || 0;
    this.nombre = user.nombre || '';
    this.correo = user.correo || '';
    this.nit = user.nit || '';
    this.fechaHoraAcceso = user.fechaHoraAcceso || '';
    this.nombreZonaFranca = user.nombreZonaFranca || '';
    this.telefono = user.telefono  || '';
    this.direccion = user.direccion || '';
    this.zona = user.zona || '';
    this.municipio = user.municipio || '';
    this.departamento = user.departamento || '';
    this.representantesLegales = user.representantesLegales || '';
    this.currentPassword = user.currentPassword || '';
    this.newPassword = user.newPassword || '';
    this.confirmPassword = user.confirmPassword || '';
    this.idRol = user.idRol || '';
    this.activo = user.activo || '';
    this.usuarioAdicion = user.usuarioAdicion || '';
    this.fechaHoraAdicion = user.fechaHoraAdicion || '';
    this.nombreRol = user.nombreRol || '';
  }
}


