import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class EditUserRouteGaurdService implements CanActivate {

  constructor(private router : Router, private cookies : CookieService, private toaster : ToastrService) { }

  canActivate(route : ActivatedRouteSnapshot):boolean{
    if(this.cookies.get('authToken')==="undefined" || this.cookies.get('authToken')==="null" || this.cookies.get('authToken') === ""){
      this.toaster.warning("not authorized");
      this.router.navigate(['/']);
      return false;
    }else {
      return true;
    }
  }
}
