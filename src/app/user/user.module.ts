import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//added modules, components and services
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EdituserComponent } from './edituser/edituser.component';
import { ForgotpwComponent } from './forgotpw/forgotpw.component';
import { EditpwComponent } from './editpw/editpw.component';
import { EditUserRouteGaurdService } from './edit-user-route-gaurd.service';

//angular modules
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//external modules
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SignupComponent, LoginComponent, EdituserComponent, ForgotpwComponent, EditpwComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path : 'signup', component : SignupComponent},
      {path : 'login', component : LoginComponent},
      {path : 'edituser', component : EdituserComponent},
      {path : 'forgotpw', component : ForgotpwComponent},
      {path : 'editpw', component : EditpwComponent, canActivate: [EditUserRouteGaurdService]}
    ])
  ]
})
export class UserModule { }
