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
    .set("userName", data.userName)
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

  //edit expense payee 
  public editExpensePayee = (data): any=>{
    let editExpensePayeeParam = new HttpParams()
    .set('expenseId', data.expenseId)
    .set("userName", data.userName) //name of the user editing the field
    .set("paidBy", data.paidBy)   //userId of the new payee
    .set("paidByUserName", data.paidByUserName)  //user name of the new payee
    return this._http.post(`${this.expenseUrl}/editExpensePayee?authToken=${this.cookies.get('authToken')}`, editExpensePayeeParam);
  }
  
  //edit expense amount
  public editExpenseAmount = (data): any=>{
    let editExpenseAmountParam = new HttpParams()
    .set("expenseId", data.expenseId)
    .set("userName", data.userName) //name of the user editing the field
    .set("newAmount", data.newAmount) //new amount that needs to be updated
    return this._http.post(`${this.expenseUrl}/editExpenseAmount?authToken=${this.cookies.get('authToken')}`, editExpenseAmountParam);
  }

  //add users to expense
  public addUsersToExpense = (data): any=>{
    let addUsersToExpenseParam = new HttpParams()
    .set("expenseId", data.expenseId)
    .set("userName", data.userName) //name of the user editing the field
    .set("addedUsers", data.addedUsers) //userIds of the new users that need to be added to the expense to be passed as a string of CSV's 
    .set("addedUsersNames", data.addedUsersNames) //user names of the new users that need to be added to the expense to be passed as a string of CSV's
    return this._http.post(`${this.expenseUrl}/addUsersToExpense?authToken=${this.cookies.get('authToken')}`, addUsersToExpenseParam);
  }

  // remove user for an expense
  public removeUsersFromExpense = (data): any=>{
    let removeUsersFromExpenseParam = new HttpParams()
    .set("expenseId", data.expenseId)
    .set("userName", data.userName) //name of the user editing the field
    .set("removeUsers", data.removeUsers) //userIds of the users that need to be removed from the expense to be passed as a string of CSV's 
    .set("removedUserNames", data.removedUserNames) //user names of the users that need to be removed from the expense to be passed as a string of CSV's
    return this._http.post(`${this.expenseUrl}/removeUsersFromExpense?authToken=${this.cookies.get('authToken')}`, removeUsersFromExpenseParam);
  }

  //settle user expense
  public settleUserExpense = (data): any=>{
    let settleUserExpenseParam = new HttpParams()
    .set("expenseId", data.expenseId)
    .set("userName", data.userName) //name of the user editing the field
    .set("payeeName", data.payeeName) //name of the payee of the expense
    return this._http.post(`${this.expenseUrl}/settleUserExpense?authToken=${this.cookies.get('authToken')}`, settleUserExpenseParam)
  }

}
