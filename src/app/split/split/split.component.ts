import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { GroupService } from 'src/app/group.service';
import { faUserFriends, faPlusCircle, faEdit, faTrash, faUndo, faRedo, faEllipsisV, faCheck, faArrowDown } from '@fortawesome/free-solid-svg-icons';

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
  public groupUsersList : any = [];
  public viewGroupUsers : boolean;
  public newExpenseTitle : string;
  public newExpenseDescription : string;
  public newExpenseAmount : number;
  public newExpensePaidBy : string;
  public expenseInvolvedMembers : any = [];
  public selectePayeeName : string;
  public selectedExpInvolvedMembers : string;

  

  constructor(private spinner : NgxSpinnerService, private cookies : CookieService, private toaster : ToastrService , private router : Router, private userService : UserService, private groupService : GroupService ) { }

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
    this.selectePayeeName = "you";
    this.selectedExpInvolvedMembers = "";
        
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
              setTimeout(()=>{
                this.availableUsersList(email);
              },500);
            })
          }, 500);
          
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
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  // --------------------------------functions using expenseService---------------------------------
  public createNewExpense = (): any=>{
    console.log(this.groupDetails);
    let expInvMems = [...new Set(this.expenseInvolvedMembers)].toString();
    
    let data = {
      groupId : this.groupDetails[0].groupId,
      expenseTitle : this.newExpenseTitle,
      description : this.newExpenseDescription,
      amount : this.newExpenseAmount,
      paidBy : this.newExpensePaidBy,
      involvedMembers : expInvMems
    }
    console.log(data);

    this.selectePayeeName = "you";
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
    }else{
      this.viewGroupUsers = false;
    }
  }
  
  //add user as expense payee
  public addPaidByUser = (userId, firstName, lastName): any=>{
    console.log(userId+" "+firstName+" "+lastName);
    this.newExpensePaidBy = userId;
    this.selectePayeeName = `${firstName} ${lastName}`;
  }

  //add user in an expense 
  public addExpenseMember = (userId, firstName, lastName): any=>{
    this.expenseInvolvedMembers.push(userId);
    console.log(this.selectedExpInvolvedMembers);
    if(this.selectedExpInvolvedMembers.length > 1){
      console.log(this.selectedExpInvolvedMembers)
      this.selectedExpInvolvedMembers = this.selectedExpInvolvedMembers +`, ${firstName} ${lastName}`
      console.log(this.selectedExpInvolvedMembers)
    }
  }



}


