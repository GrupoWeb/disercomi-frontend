export class DocumentTable {
  id: number;
  idArchivo: number;
  extension: string;
  tipoContenido: string;
  usuarioAdicion: string;
  fechaHoraAdicion: string;
  idTipoArchivo: string;
  nombreTipoArchivo: string;


  constructor(documentTable: DocumentTable) {
    this.id = documentTable.id || this.getRandomID();
    this.idArchivo = documentTable.idArchivo || 0;
    this.extension = documentTable.extension || '';
    this.tipoContenido = documentTable.tipoContenido || '';
    this.usuarioAdicion = documentTable.usuarioAdicion || '';
    this.fechaHoraAdicion = documentTable.fechaHoraAdicion || '';
    this.idTipoArchivo = documentTable.idTipoArchivo || '';
    this.nombreTipoArchivo = documentTable.nombreTipoArchivo || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
