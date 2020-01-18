import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { GroupService } from 'src/app/group.service';
import { faUserFriends, faPlusCircle, faEdit, faTrash, faWallet, faMoneyBillWave, faPlus, faMinus, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import { ExpenseService } from 'src/app/expense.service';

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css'],
  providers : [SocketService]
})
export class SplitComponent implements OnInit {

  @ViewChild('scrollMe', {read : ElementRef, static : true})
  public scrollMe : ElementRef;

  //defining font icons
  public groupIcon = faUserFriends;
  public plusIcon = faPlusCircle;
  public editIcon = faEdit;
  public recycleIcon = faTrash;
  public optionsIcon = faEllipsisV;
  public wallet = faWallet;
  public simplePlusIcon = faPlus;
  public simpleMinusIcon = faMinus;
  public settleIcon = faMoneyBillWave;

  //public variables
  public authToken : string;
  public userName : string;
  public userId : string;
  public groups : any = [];
  public splitUsers : any = [];
  public groupDetails : any =[];
  public selectedGroupId : string;
  public newGroupName : string;
  public selectGroupPrompt : boolean;
  public firstChar : string;
  public groupCreatedOn : string;
  public groupUsersList : any[] = [];
  public viewGroupUsers : boolean;
  public newExpenseTitle : string;
  public newExpenseDescription : string;
  public newExpenseAmount : number;
  public newExpensePaidBy : string;
  public expenseInvolvedMembers : any = [];
  public selectedPayeeName : string;
  public selectedExpInvolvedMembers : string;
  public selectedMembersFlag : boolean;
  public selectedPayeeNameFlag : boolean;
  public expenses : any [] = [];
  public viewWhomYouOwe : boolean;
  public viewWhoOwesYou : boolean;
  public selectExpenseId : string;
  public owedBy : string []= [];
  public payeeName : string;  
  public expenseAmount : number;
  public allGroupBalances :any[] = [];
  public allGroupDebt : any[] = [];
  public allGroupCreditsBalance : any[] = [];
  public currentExpenseId : string;
  public selectedExpenseDetails : any[] = [];
  public newChangedAmount : number;
  public existingUsersNames : string;
  public addingUsers :any[] = [];
  public addedUsersNames : string;
  public expenseHistory : any[] = [];
  public existingUsers :any[] = [];
  public displayExistingUsers :any[] = [];
  public displayExistingUsersString :string;
  public removingUserIds :any[] = [];
  public removingUserNames :any [] = [];

  constructor(private spinner : NgxSpinnerService, private cookies : CookieService, private toaster : ToastrService , private router : Router, private userService : UserService, private groupService : GroupService, private expenseService : ExpenseService) { }

  ngOnInit() {

    this.spinner.show();
    setTimeout(()=>{
      this.spinner.hide();
    }, 2500)

    
    
    this.authToken = this.cookies.get('authToken');
    this.userName = this.cookies.get('userName');
    this.userId = this.cookies.get('userId');
    this.newExpenseTitle = "";
    this.newExpenseDescription = "";
    this.newExpenseAmount = 0;
    this.newExpensePaidBy = this.userId;
    this.selectGroupPrompt = true;
    this.selectedExpInvolvedMembers = "";
    this.selectedMembersFlag = true;
    this.selectedPayeeNameFlag = true;
        
    this.groupsOfUser(this.cookies.get('email'));
    this.getAllUsers();   

  }

  //----------------------functions using groupService------------------

  //get the groups details that the user is member of
  public groupsOfUser = (email):any=>{
    this.groupService.getAllGroupsOfUser(email).subscribe(
      data=>{
        if(data.status== 200){
          this.groups = [];
          for(let x of data.data){
            this.groups.push(x);
          }
        }else if(data.status == 404){
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //get single group details
  public getSingleGroup = (groupId):any=>{
    let request = {
      groupId : groupId
    }
    this.selectedGroupId = groupId;
    this.groupService.getGroupDetails(request).subscribe(
      data=>{
        this.groupDetails = [];
        this.groupUsersList = [];
        if(data.status == 200){
          this.groupDetails = data.data;
          this.firstChar = data.data[0].groupName[0];
          this.groupCreatedOn = data.data[0].groupCreatedOn.split('T')[0];
          this.selectGroupPrompt = false;
          this.getAllUsers();
          setTimeout(()=>{
            data.data[0].groupUsers.map((email)=>{
              this.availableGroupUsersList(email);
              this.viewGroupUsers = true;
              this.viewWhoOwesYou = false;
              this.viewWhomYouOwe = false;
              setTimeout(()=>{
                this.availableUsersList(email);
              },500);
            })
          }, 500);
          this.getAllExpensesOfGroup();
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //create new group
  public createNewGroup = (): any=>{
    let newGroupRequest = {
      groupName : this.newGroupName,
      groupUsers : this.cookies.get('email')
    }
    this.groupService.createNewGroup(newGroupRequest).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.groupsOfUser(this.cookies.get('email'));
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //add users to the group
  public addUserToGroup = (email) : any=>{
    let data = {
      groupId : this.groupDetails[0].groupId,
      email : email
    }
    this.groupService.addUserToGroup(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.availableUsersList(email);
          setTimeout(()=>{
            this.availableUsersList(email);
          },500);       
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  // --------------------------------functions using expenseService---------------------------------
  
  // create a new expense in the group
  public createNewExpense = (): any=>{
    console.log(this.groupDetails);
    let expInvMems = [...new Set(this.expenseInvolvedMembers)].toString();    
    let data = {
      groupId : this.groupDetails[0].groupId,
      expenseTitle : this.newExpenseTitle,
      description : this.newExpenseDescription,
      amount : this.newExpenseAmount,
      paidBy : this.newExpensePaidBy,
      involvedMembers : expInvMems,
      userName : this.userName
    }
    this.expenseService.createNewExpense(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.selectedPayeeName = "you";
          this.getAllExpensesOfGroup();
        }else{
          this.toaster.warning(data.message);
          this.selectedPayeeName = "you";
          this.getAllExpensesOfGroup();
        }
      }
    )
  }

  // get all the expenses of the group
  public getAllExpensesOfGroup = (): any=>{
    let data = {
      groupId : this.groupDetails[0].groupId
    }
    this.allGroupBalances = [];
    this.allGroupDebt = [];
    this.allGroupCreditsBalance = [];
    this.expenseService.getAllGroupExpenses(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          console.log(data);
          this.expenses = data.data;
          this.expenses.forEach((expense)=>{
            this.getAllGroupBalances(expense.expenseId);
            this.groupUsersList.map((user)=>{
              if(user.userId == expense.expenseCreatedBy){
                  expense['expenseCreatorName']= `${user.firstName} ${user.lastName}`
              }
            })
          })
          this.expenses.forEach((expense)=>{
            this.groupUsersList.map((user)=>{
              if(user.userId == expense.expenseModifiedBy){
                  expense['expenseModifierName']= `${user.firstName} ${user.lastName}`
              }
            })
          })
          setTimeout(()=>{
            this.calculateUserPendingCredits();
            this.calculateUserPendingDebts();
          }, 200);

        }else if (data.status == 404){
          this.toaster.warning(data.message);
          this.expenses = [];
        }else{
          this.toaster.warning(data.message);
          this.expenses = [];
        }
      }
    )
  }

  //get all pending balances of the group
  public getAllGroupBalances = (expenseId): any=>{
    let data = {
      expenseId : expenseId
    }
    this.currentExpenseId = expenseId;
    this.expenseService.getAllExpenseBalance(data).subscribe(
      data=>{
        if(data.status == 200){
          data.data.forEach(balance => {
            this.allGroupBalances.push(balance)
          });
          // this.allGroupBalances.push(data.data);
        }else {
          this.toaster.warning(data.message);
        }      
      }
    )
  }

  //get the balances of selected expense
  public getAllExpenseBalance = (expenseId): any=>{
    let data = {
      expenseId : expenseId
    }
    this.owedBy = [];
    this.payeeName = "";
    this.expenseAmount = 0;
    this.expenseService.getAllExpenseBalance(data).subscribe(
      data=>{
        if(data.status == 200){
          console.log(data)
          console.log(this.groupUsersList);
          this.groupUsersList.map((user)=>{
            if(user.userId == data.data[0].payee){
              this.payeeName = `${user.firstName} ${user.lastName}`;
            }
          });
          data.data.forEach(balance => {
            this.groupUsersList.map((user)=>{
              if(user.userId == balance.owedBy && user.userId != balance.payee){
                this.owedBy.push(`${user.firstName} ${user.lastName} owes ${this.payeeName} an amount of ${balance.debtAmount}`)
              }
            })
            console.log(this.owedBy)
          });
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //get single expense details
  public getSingleExpenseDetails = (expenseId): any=>{
    this.selectedExpenseDetails = [];
    this.existingUsersNames = "";
    this.addingUsers = [];
    this.addedUsersNames = "";
    this.existingUsers = [];
    this.displayExistingUsers = [];
    this.displayExistingUsersString = "";
    this.removingUserIds = [];
    this.removingUserNames = [];
    let data = {
      expenseId : expenseId
    }
    this.expenseService.getExpenseDetails(data).subscribe(
      data=>{
        if(data.status == 200){
          console.log("single expense retreived");
          console.log(data);
          this.selectedExpenseDetails = data.data;
          this.newChangedAmount = data.data.expenseAmount;
          this.expenseHistory = data.data.expenseLatestModification;
          console.log(this.groupUsersList);
          data.data.expenseMembers.forEach((user)=>{
            this.groupUsersList.map((groupUser)=>{
              if(groupUser.userId == user){
                this.existingUsers.push(groupUser);
                this.displayExistingUsers.push(`${groupUser.firstName} ${groupUser.lastName}`)
              }
            })
          })
          this.displayExistingUsersString = this.displayExistingUsers.toString();
          data.data.expenseMembers.forEach((user)=>{
            this.createExistingUserName(user);
          })
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //delete expense and all the related balances
  public deleteExpense = (): any=>{
    let data = {
      expenseId : this.selectExpenseId
    }
    this.expenseService.deleteExpense(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getAllExpensesOfGroup();
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //change amount of the expense
  public changeAmount = (): any=>{
    let data = {
      expenseId : this.selectExpenseId,
      userName : this.userName,
      newAmount : this.newChangedAmount
    }
    this.expenseService.editExpenseAmount(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getAllExpensesOfGroup();
        }else {
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //add users to existing expense
  public addUsersToExistingExpense = (): any=>{
    let data = {
      expenseId : this.selectExpenseId,
      userName : this.userName,
      addedUsers : this.addingUsers.toString(),
      addedUsersNames : this.addedUsersNames
    }
    console.log(data);
    this.expenseService.addUsersToExpense(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getAllExpensesOfGroup();
        }else {
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //remove users from existing expense
  public removeUsersFromExistingExpense = (): any=>{
    let data = {
      expenseId : this.selectExpenseId,
      userName : this.userName,
      removeUsers : this.removingUserIds.toString(),
      removedUserNames : this.removingUserNames.toString()
    }
    console.log(data);
    this.expenseService.removeUsersFromExpense(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getAllExpensesOfGroup();
        }else {
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //settle logged in user's share of the expense
  public settleUserShareOfExpense = (): any=>{
    let name = ""
    this.groupUsersList.map((user)=>{
      if(user.userId == this.selectedExpenseDetails["expensePaidBy"]){
       name = `${user.firstName} ${user.lastName}`
      }
    })
    let data = {
      expenseId : this.selectExpenseId,
      userName : this.userName,
      payeeName : name
    }
    this.expenseService.settleUserExpense(data).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getAllExpensesOfGroup();
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //----------------------functions using userService---------------------

  // get all the users of the application available for adding to groups
  public getAllUsers = ():any=>{
    this.userService.getAllUserDetails().subscribe(
      data=>{
        if(data.status == 200){
          this.splitUsers = [];
          for(let user of data.data){
            this.splitUsers.push(user);            
          }
          this.availableGroupUsersList(this.cookies.get('email'));
          this.availableUsersList(this.cookies.get('email'));
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //logout user
  public logout = ():any=>{
    this.userService.logout().subscribe(
      data=>{
        if(data.status == 200){
          console.log(data);
          this.toaster.success(data.message);
          setTimeout(()=>{
            this.router.navigate(['/']);
          },500)
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }


  //--------------------------generic functions----------------

  // update a list of splitUsers for adding to groups
  public availableUsersList = (email):any=>{
    console.log("split users")
    this.splitUsers.map((user)=>{
      if(user.email == email){
        let index = this.splitUsers.indexOf(user);
        this.splitUsers.splice(index, 1);
      }
    })  
  }

  // update a list of splitUsers for adding to groups
  public availableGroupUsersList = (email):any=>{
    console.log("groupUsers")
    this.splitUsers.map((user)=>{
      if(user.email == email){
        this.groupUsersList.push(user);
      }
    })
  }

  //create a list of existing user names of the selected expense
  public createExistingUserName = (user): any=>{
    console.log("create existing user name : "+user);
    this.groupUsersList.forEach((groupUser)=>{
      if(groupUser.userId == user){
        this.existingUsersNames = this.existingUsersNames +(`${groupUser.firstName} ${groupUser.lastName}, `);
      }
    })
  }

  //add users to existing user names for adding users to expense and create a string of added userId's
  public addMoreExpenseUsers = (userId): any=>{
    this.addingUsers.push(userId);
    this.createExistingUserName(userId);
    this.groupUsersList.forEach((groupUser)=>{
      if(groupUser.userId == userId){
        if(this.addedUsersNames.length > 1){
          this.addedUsersNames = this.addedUsersNames +(`, ${groupUser.firstName} ${groupUser.lastName}`);
        }else {
          this.addedUsersNames = `${groupUser.firstName} ${groupUser.lastName}`
        }
      }
    })
  }

  //remove users from the display array and create a string of removing user's ids and removing users names
  public removeExpenseUsers = (userId, firstName, lastName):any=>{
    this.existingUsers.map((user)=>{
      if(user.userId == userId){
        this.existingUsers.splice(this.existingUsers.indexOf(user), 1);
        this.displayExistingUsers = [];
        this.existingUsers.forEach((availableUser)=>{
          this.displayExistingUsers.push(`${availableUser.firstName} ${availableUser.lastName}`)
        })
      }
    })
    this.displayExistingUsersString = this.displayExistingUsers.toString();
    this.removingUserIds.push(userId)
    this.removingUserNames.push(` ${firstName} ${lastName}`)
  }

  //group details view modifier
  public groupDetailsView = (selector):any=>{
    console.log(selector);
    if(selector == "groupUsers"){
      this.viewGroupUsers = true;
      this.viewWhoOwesYou = false;
      this.viewWhomYouOwe = false;
    }else if (selector == "whoOwesYou"){
      this.viewGroupUsers = false;
      this.viewWhoOwesYou = true;
      this.viewWhomYouOwe = false;
    }else if(selector == "whomYouOwe"){
      this.viewGroupUsers = false;
      this.viewWhoOwesYou = false;
      this.viewWhomYouOwe = true;
    }
  }
  
  //add user as expense payee
  public addPaidByUser = (userId, firstName, lastName): any=>{
    console.log(userId+" "+firstName+" "+lastName);
    this.newExpensePaidBy = userId;
    this.selectedPayeeNameFlag = false
    this.selectedPayeeName = `${firstName} ${lastName}`;
  }

  //add user in an expense 
  public addExpenseMember = (userId, firstName, lastName): any=>{
    this.expenseInvolvedMembers.push(userId);
    if(this.selectedExpInvolvedMembers.length > 1){
      this.selectedExpInvolvedMembers = this.selectedExpInvolvedMembers +`, ${firstName} ${lastName}`
    }else{
      this.selectedMembersFlag = false;
      this.selectedExpInvolvedMembers = `${firstName} ${lastName}`;
    }
  }

  //select expense
  public selectExpense =(expenseId):any=>{
    this.selectExpenseId = expenseId;
    this.getAllExpenseBalance(expenseId);
    this.getSingleExpenseDetails(expenseId);
  }

  //calculate the total pending settlements of the group
  public calculateUserPendingCredits = (): any=>{
    let owers = [];
    this.allGroupBalances.forEach((balance)=>{
      if(balance.owedBy != this.userId){
        owers.push(balance.owedBy);
      }
    })
    let newOwers = [... new Set(owers)]
    newOwers.forEach((user)=>{
      this.allGroupDebt[user] = 0;
      this.allGroupBalances.forEach((balance)=>{
        if(balance.owedBy == user){
          this.allGroupDebt[user] = this.allGroupDebt[user]+balance.debtAmount;
        }
      })
    })
  }

  //get payee name
  public getPayeeName = ()=>{
    let name = ""
    this.groupUsersList.map((user)=>{
      if(user.userId == this.selectedExpenseDetails["expensePaidBy"]){
        name = `${user.firstName} ${user.lastName}`
      }
    })
    console.log(name);
    return name;
  }
  
  //calculate the total dues of the user for the group
  public calculateUserPendingDebts = () : any=>{
    let debts = [];
    this.allGroupBalances.forEach((balance)=>{
      if(balance.owedBy == this.userId && balance.payee != this.userId){
        debts.push(balance.payee);
      }
      let newDebts = [... new Set(debts)]
      newDebts.forEach((user)=>{
        this.allGroupCreditsBalance[user] = 0;
        this.allGroupBalances.forEach((balance)=>{
          if(balance.payee == user && balance.owedBy == this.userId){
            this.allGroupCreditsBalance[user] = this.allGroupCreditsBalance[user]+balance.debtAmount;
          }
        })
      })
    })
    console.log(this.allGroupCreditsBalance);
  }

}


