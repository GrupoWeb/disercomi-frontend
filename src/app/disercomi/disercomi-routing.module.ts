import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from "./perfil/perfil.component";
import { DocumentoComponent } from "./documento/documento.component";
import { RealizarSolicitudesComponent } from "./realizar-solicitudes/realizar-solicitudes.component";
import { HistorialSolicitudesComponent } from "./historial-solicitudes/historial-solicitudes.component";
import { ReasignarSolicitudesComponent } from "./reasignar-solicitudes/reasignar-solicitudes.component";
import { HistorialCalificacionesComponent } from "./historial-calificaciones/historial-calificaciones.component";
import {IncisosArancelariosComponent} from "./incisos-arancelarios/incisos-arancelarios.component";
import {RoleGuard} from "@core/guard/role.guard";

const routes: Routes = [
  {
    path: "perfil",
    component: PerfilComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU08'] },
  },
  {
    path: 'documentos',
    component: DocumentoComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU08'] },
  },
  {
    path: 'solicitudes/realizar',
    component: RealizarSolicitudesComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU08'] },
  },
  {
    path: 'solicitudes/historial',
    component: HistorialSolicitudesComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU08'] },
  },
  {
    path: 'solicitudes/reasignar',
    component: ReasignarSolicitudesComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU08'] },
  },
  {
    path: 'calificaciones/historial',
    component: HistorialCalificacionesComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU07'] },
  },
  {
    path: 'solicitudes/incisos/:id',
    component: IncisosArancelariosComponent,
    canActivate: [RoleGuard],
    data: { allowedRoles: ['RU07'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisercomiRoutingModule { }
