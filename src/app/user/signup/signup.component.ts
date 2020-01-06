import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName : string;
  public lastName : string;
  public email : string;
  public emailid : string;
  public loginpassword : string;
  public password : string;
  public countryName : string;
  public countryList : any = [];
  public countryPhoneCode : string;
  public mobileNumber : String;

  constructor(private _http: UserService, public cookies: CookieService, public toaster : ToastrService, public router : Router) { }

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

  public signupFunction = (): any =>{
    let data = {
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email,
      password : this.password,
      countryName : this.countryName,
      mobileNumber : this.mobileNumber
    }
    if(!this.firstName){
      this.toaster.warning("please enter first name");
    }else if(!this.lastName){
      this.toaster.warning("please enter last name");
    }else if(!this.email){
      this.toaster.warning("please enter email");
    }else if(!this.password){
      this.toaster.warning("please enter password");
    }else if(!this.countryName){
      this.toaster.warning("please select a country");
    }else if(!this.mobileNumber){
      this.toaster.warning("please enter mobile number")
    }else {
      console.log(data);
      this._http.signupUser(data).subscribe(
        data=>{
          if(data.status == "200"){
            this.toaster.success("your account creation successful");
            setTimeout(()=>{
              this.router.navigate(['/']);
            }, 1000)
          }else {
            this.toaster.error(data.message);
          }
        }
      )
    }
  }

  public loginFunction = (): any =>{
    let data = {
      email : this.emailid,
      password : this.loginpassword
    }
    this._http.loginUser(data).subscribe(
      data=>{
        if(data.status == "200"){
          this.toaster.success("login success");
          setTimeout(()=>{
            this.cookies.set('userName', `${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`);
            this.cookies.set('userId', data.data.userDetails.userId);
            this.cookies.set('authToken', data.data.authToken);
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
