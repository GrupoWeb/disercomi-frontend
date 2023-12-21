import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from "./perfil/perfil.component";
import { DocumentoComponent } from "./documento/documento.component";

const routes: Routes = [
  {
    path: "perfil",
    component: PerfilComponent,
  },
  {
    path: 'documentos',
    component: DocumentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisercomiRoutingModule { }
