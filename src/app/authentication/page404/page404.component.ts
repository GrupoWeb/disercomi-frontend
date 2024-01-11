import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        RouterLink,
    ],
})
export class Page404Component {
  constructor(
    private router: Router,
  ) {
    // constructor
  }

  returnInicio(){
    this.router.navigate(['/disercomi/perfil'])
  }
}
