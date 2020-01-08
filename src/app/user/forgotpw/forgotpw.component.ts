import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpw',
  templateUrl: './forgotpw.component.html',
  styleUrls: ['./forgotpw.component.css']
})
export class ForgotpwComponent implements OnInit {

  public countryList : any = [];
  public countryPhoneCode : string;
  public email : string;
  public mobileNumber : string;
  public twoMinuteToken : boolean = false;


  constructor(private _http : UserService, private router : Router, private cookies : CookieService, private toaster : ToastrService) { }

  ngOnInit() {
    this.getCountryList();
  }

  public goToSignin = (): any =>{
    this.router.navigate(['login']);
  }

  public getCountryList = (): any =>{
    this._http.getCountryList().subscribe(
      data=>{
        this.countryList = [];
        for(let x of data.data){
          this.countryList.push(x);
        }        
      }
    )
  }

  public getCountryCode = (country): any=>{
    this._http.getPhoneCode(country).subscribe(
      data=>{
        this.countryPhoneCode = `+${data.data}`
        console.log(this.countryPhoneCode);
      }
    )
  }

  public forgotPassword = (): any=>{
    let data = {
      email : this.email,
      mobileNumber : this.mobileNumber
    }
    this._http.forgotPassword(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success("edit password link valid for 2 minutes",data.message, {timeOut : 3000});
          setTimeout(()=>{
            this.cookies.set('authToken', data.data.authToken);
            this.cookies.set('email',data.data.userDetails.email)
            this.twoMinuteToken = true;
          }, 1000);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }
}
