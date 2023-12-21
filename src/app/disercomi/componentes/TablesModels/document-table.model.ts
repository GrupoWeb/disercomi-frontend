export class DocumentTable {
  idArchivo: number;
  extension: string;
  tipoContenido: string;
  usuarioAdicion: string;
  fechaHoraAdicion: string;
  idTipoArchivo: string;
  nombreTipoArchivo: string;


  constructor(documentTable: DocumentTable) {
    this.idArchivo = documentTable.idArchivo || 0;
    this.extension = documentTable.extension || '';
    this.tipoContenido = documentTable.tipoContenido || '';
    this.usuarioAdicion = documentTable.usuarioAdicion || '';
    this.fechaHoraAdicion = documentTable.fechaHoraAdicion || '';
    this.idTipoArchivo = documentTable.idTipoArchivo || '';
    this.nombreTipoArchivo = documentTable.nombreTipoArchivo || '';
  }
}
