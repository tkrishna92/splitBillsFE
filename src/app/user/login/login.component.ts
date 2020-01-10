import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email : string;
  public password : string;

  constructor(private _http : UserService, private toaster : ToastrService, private cookies : CookieService, private router : Router) { }

  ngOnInit() {
  }

  public goToSignup = (): any =>{
    this.router.navigate(['signup']);
  }

  public loginFunction = (): any =>{
    let data = {
      email : this.email,
      password : this.password
    }
    this._http.loginUser(data).subscribe(
      data=>{
        if(data.status == "200"){
          this.toaster.success("login success");
          setTimeout(()=>{
            this.cookies.set('userName', `${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`);
            this.cookies.set('userId', data.data.userDetails.userId);
            this.cookies.set('authToken', data.data.authToken);
            this.cookies.set('email', data.data.userDetails.email)
            this._http.setUserDetails(data.data.userDetails);
            this.router.navigate(['split']);
          }, 1000)
        }else {
          this.toaster.warning(data.message);
        }
      }
    )
  }

  

}
