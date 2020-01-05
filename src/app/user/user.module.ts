import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EditpasswordComponent } from './editpassword/editpassword.component';
import { EdituserComponent } from './edituser/edituser.component';
import { ForgotpwComponent } from './forgotpw/forgotpw.component';
import { EditpwComponent } from './editpw/editpw.component';



@NgModule({
  declarations: [SignupComponent, LoginComponent, EditpasswordComponent, EdituserComponent, ForgotpwComponent, EditpwComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
