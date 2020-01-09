import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  public groupUrl = "http://localhost:3000/api/v1/users";

  constructor(private _http : HttpClient, private cookies : CookieService) { }

  //createNewGroup
  public createNewGroup = (data):any=>{
    let newGroupParams = new HttpParams()
    .set('groupName', data.groupName)
    .set('groupUsers', data.groupUsers)
    return this._http.post(`${this.groupUrl}/createNewGroup?authToken=${this.cookies.get('authToken')}`,newGroupParams);
  }

  //add user to the group
  public addUserToGroup = (data):any=>{
    let addUserParam = new HttpParams()
    .set('groupId', data.groupId)
    .set('userId', data.userId)
    return this._http.post(`${this.groupUrl}/addUserToGroup?authToken=${this.cookies.get('authToken')}`, addUserParam);
  }

  //get all the groups of the user
  public getAllGroupsOfUser = (): any=>{
    return this._http.get(`${this.groupUrl}/getAllGroupsOfUser?authToken=${this.cookies.get('authToken')}`);
  }

  //get group details
  public getGroupDetails = (data): any=>{
    let groupDetailsParams = new HttpParams()
    .set('groupId', data.groupId)
    return this._http.post(`${this.groupUrl}/getGroupDetails?authToken=${this.cookies.get('authToken')}`,groupDetailsParams);
  }

}
