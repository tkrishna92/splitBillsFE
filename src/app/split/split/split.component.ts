import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { GroupService } from 'src/app/group.service';
import { faUserFriends, faPlusCircle, faEdit, faTrash, faWallet, faPlus, faMinus, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
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


