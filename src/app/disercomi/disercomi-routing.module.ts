import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from "./perfil/perfil.component";
import { DocumentoComponent } from "./documento/documento.component";
import { RealizarSolicitudesComponent } from "./realizar-solicitudes/realizar-solicitudes.component";
import { HistorialSolicitudesComponent } from "./historial-solicitudes/historial-solicitudes.component";
import { ReasignarSolicitudesComponent } from "./reasignar-solicitudes/reasignar-solicitudes.component";
import { HistorialCalificacionesComponent } from "./historial-calificaciones/historial-calificaciones.component";

const routes: Routes = [
  {
    path: "perfil",
    component: PerfilComponent,
  },
  {
    path: 'documentos',
    component: DocumentoComponent,
  },
  {
    path: 'solicitudes/realizar',
    component: RealizarSolicitudesComponent,
  },
  {
    path: 'solicitudes/historial',
    component: HistorialSolicitudesComponent,
  },
  {
    path: 'solicitudes/reasignar',
    component: ReasignarSolicitudesComponent,
  },
  {
    path: 'calificaciones/historial',
    component: HistorialCalificacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisercomiRoutingModule { }
