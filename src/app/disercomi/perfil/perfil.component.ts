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
import { UserService } from '../componentes/Services/user.service'
import {ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder,} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

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
    ReactiveFormsModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit{

  passwordForm?: UntypedFormGroup;
  userForm: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar
  ) {
    const blankObject = {} as User;
    this.userForm = new User(blankObject);
    this.passwordForm = this.createUserForm();
  }



  formControl = new UntypedFormControl('', [
    Validators.required
  ])

  ngOnInit(): void {
    this.setProfileUser()
  }
  setProfileUser(){
    return this.authService.currentProfileUserValue;
  }

  createUserForm(): UntypedFormGroup {
    return this.fb.group(
      {
        currentPassword: [this.userForm.currentPassword],
        newPassword: [this.userForm.newPassword],
        confirmPassword: [this.userForm.confirmPassword]
      }
    )
  }

  public changePassword() {
    const respuesta  =  this.userService.changePassword(this.passwordForm?.getRawValue())
    console.log(respuesta)
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  submit(){}
}
