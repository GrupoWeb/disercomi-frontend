import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {AuthService, User} from "@core";
import { CommonModule } from "@angular/common";
import { UserService } from '@core/service/user.service'
import {ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit{

  passwordForm?: UntypedFormGroup;
  userForm: User;
  buttonAccion: boolean

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar
  ) {
    const blankObject = {} as User;
    this.userForm = new User(blankObject);
    this.passwordForm = this.createUserForm();
    this.buttonAccion = false
  }



  formControl = new UntypedFormControl('', [
    Validators.required
  ])

  ngOnInit(): void {
    this.setProfileUser()
  }
  setProfileUser(): User{
    return this.authService.currentProfileUsersValue;
  }
  createUserForm(): UntypedFormGroup {
    return this.fb.group(
      {
        currentPassword: [this.userForm.currentPassword, Validators.required],
        newPassword: [this.userForm.newPassword, Validators.required],
        confirmPassword: [this.userForm.confirmPassword, Validators.required]
      },
      {
        validator: this.checkPasswords.bind(this),
      }
    )
  }
  checkPasswords(group: FormGroup) {
    const newPasswordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (newPasswordControl && confirmPasswordControl) {
      const newPassword = newPasswordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (newPassword === confirmPassword) {
        return null;
      } else {
        return { notSame: true };
      }
    }

    return null;
  }
  public changePassword() {
    this.buttonAccion = !this.buttonAccion
    if(this.passwordForm?.valid) {
      this.userService.changePassword(this.passwordForm?.getRawValue())
        .subscribe({
            next: () => {
              this.showNotification('snackbar-success','Contraseña actializada','top','center')
              this.passwordForm?.reset()
              this.buttonAccion = !this.buttonAccion
            },
          error: (err: HttpErrorResponse) => {
            this.buttonAccion = !this.buttonAccion
          }
        })
    }else {
      this.buttonAccion = !this.buttonAccion
      this.showNotification('snackbar-info','No coiciden la nueva contraseña','top','center')
    }
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 4000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
