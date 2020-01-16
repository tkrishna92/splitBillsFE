import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  public expenseUrl = "http://localhost:3000/api/v1/expense";

  constructor(private _http : HttpClient, private cookies : CookieService) { }

  // create new expense
  public createNewExpense = (data):any =>{
    let newExpenseParams = new HttpParams()
    .set("groupId", data.groupId)
    .set("title", data.expenseTitle)
    .set("description", data.description)
    .set("involvedMembers", data.involvedMembers)
    .set("amount", data.amount)
    .set("paidBy", data.paidBy)
    return this._http.post(`${this.expenseUrl}/createNewExpense?authToken=${this.cookies.get('authToken')}`, newExpenseParams);
  }

  // get all expenses of the group
  public getAllGroupExpenses = (data): any=>{
    let groupParam = new HttpParams()
    .set("groupId", data.groupId)
    return this._http.post(`${this.expenseUrl}/getAllGroupExpenses?authToken=${this.cookies.get('authToken')}`, groupParam);
  }

  //get expense details
  public getExpenseDetails = (data): any=>{
    let expenseDetailsParam = new HttpParams()
    .set("expenseId", data.expenseId)
    return this._http.put(`${this.expenseUrl}/getExpenseDetails?authToken=${this.cookies.get('authToken')}`, expenseDetailsParam);
  }

  //get all balances of the expense
  public getAllExpenseBalance = (data): any =>{
    let expenseParam = new HttpParams()
    .set("expenseId", data.expenseId)
    return this._http.post(`${this.expenseUrl}/getAllExpenseBalance?authToken=${this.cookies.get('authToken')}`, expenseParam);
  }

  // delete expense and related balances
  public deleteExpense = (data): any=>{
    let deleteExpenseParam = new HttpParams()
    .set("expenseId", data.expenseId)
    return this._http.put(`${this.expenseUrl}/deleteExpense?authToken=${this.cookies.get('authToken')}`,deleteExpenseParam)
  }

  



}
