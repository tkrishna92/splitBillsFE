import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userUrl = "http://localhost:3000/api/v1/users";

  constructor(private _http : HttpClient, private cookies : CookieService) { }

  //signup user
  public signupUser(data) : any {
    const signupParams = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('email', data.email)
    .set('password', data.password)
    .set('country', data.countryName)
    .set('phoneCode',data.phoneCode)
    .set('mobileNumber', data.mobileNumber)

    return this._http.post(`${this.userUrl}/signup`, signupParams);
  }

  //for signup purpose
  public getCountryList(): any {
    return this._http.get(`${this.userUrl}/getCountryCodes`);
  }

  //get country telephone code for signup purpose
  public getPhoneCode(country): any{
    const countryParam = new HttpParams()
    .set('countryName', country);
    return this._http.post(`${this.userUrl}/getCountryPhoneCode`, countryParam);
  }

  //for login purpose
  public loginUser(data) : any{
    const loginParams = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)
    
    return this._http.post(`${this.userUrl}/login`, loginParams)
  }

  //for saving the user details in local storage
  public setUserDetails(data){
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  //for getting logged in user's details from local storage
  public getUserDetails(){
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  //for getting logged in user details
  public getSingleUserDetails(userId): any{
    const userDetailParam = new HttpParams()
    .set('userId', userId)
    return this._http.post(`${this.userUrl}/getUserDetails?authToken=${this.cookies.get('authToken')}`, userDetailParam);
  }

  //for editing user details
  public editUser(data): any{
    const editParam = new HttpParams()
    .set('userId', data.userId)
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobileNumber', data.mobileNumber)
    .set('country', data.country)
    return this._http.post(`${this.userUrl}/editUser?authToken=${this.cookies.get('authToken')}`,editParam);
  }

  //for forgot password
  public forgotPassword(data): any{
    const forgotParams = new HttpParams()
    .set('email',data.email)
    .set('mobileNumber', data.mobileNumber)
    return this._http.post(`${this.userUrl}/forgotPassword`, forgotParams);
  }

  //for edit password
  public editPassword(data): any{
    const editPasswordParam = new HttpParams()
    .set('password', data.password)
    return this._http.post(`${this.userUrl}/editPassword?authToken=${this.cookies.get('authToken')}`, editPasswordParam);
  }

  //for getting all the user details of all the users using the application
  public getAllUserDetails(): any{
    return this._http.get(`${this.userUrl}/getAllUsers?authToken=${this.cookies.get('authToken')}`);
  }

//log out user
public logout(): any{
  return this._http.get(`${this.userUrl}/logout?authToken=${this.cookies.get('authToken')}`);
}

}
