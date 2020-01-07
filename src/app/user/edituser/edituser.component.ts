import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  public userId : string;
  public email : string;
  public firstName : string;
  public lastName : string;
  public mobileNumber : string;
  public countryName : string;
  public countryList : any = [];
  public countryPhoneCode :string;

  constructor(private _http: UserService, private router:Router, private cookies : CookieService, private toaster : ToastrService) { }

  ngOnInit() {
    this.getCountryList();
    this.getUserDetails(this.cookies.get('userId'));
  }

  public getUserDetails = (userId):any =>{
    this._http.getSingleUserDetails(userId).subscribe(
      data=>{
        if(data.status == 200){
          this.email = data.data.email;
          this.firstName = data.data.firstName;
          this.lastName = data.data.lastName;
          this.countryName = data.data.country;
          this.mobileNumber = data.data.mobileNumber;
        }else{
          this.toaster.error(data.message);
        }
      }
    )
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

  public editUser = (): any=>{
    let data = {
      userId : this.cookies.get('userId'),
      email : this.email,
      firstName : this.firstName,
      lastName : this.lastName,
      mobileNumber : this.mobileNumber,
      country : this.countryName
    }
    this._http.editUser(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          setTimeout(()=>{
            this.router.navigate(['split']);
          }, 1000);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  public goToSplit =():any=>{
    this.router.navigate(['split']);
  }


}
