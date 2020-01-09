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

  constructor(private spinner : NgxSpinnerService, private cookies : CookieService, private toaster : ToastrService, private router : Router, private userService : UserService, private groupService : GroupService ) { }

  ngOnInit() {

    this.spinner.show();
    setTimeout(()=>{
      this.spinner.hide();
    }, 2500)

    this.authToken = this.cookies.get('authToken');
    this.userName = this.cookies.get('userName');
    this.userId = this.cookies.get('userId');


  }

  //get the groups details that the user is member of
  public groupsOfUser = ():any=>{
    this.groupService.getAllGroupsOfUser().subscribe(
      data=>{
        if(data.status== 200){
          this.groups = [];
          for(let x of data.data){
            this.groups.push(x);
          }
          console.log(this.groups);
        }else if(data.status == 404){
          this.toaster.warning(data.message);
        }
      }
    )
  }

  // get all the users of the application available for adding to groups
  public getAllUsers = ():any=>{
    this.userService.getAllUserDetails().subscribe(
      data=>{
        if(data.status == 200){
          this.splitUsers = [];
          for(let user of data.data){
            this.splitUsers.push(user);
          }
          console.log(this.splitUsers)
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

}
