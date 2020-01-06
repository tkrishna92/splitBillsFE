import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitComponent } from './split/split.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [SplitComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path : 'split', component : SplitComponent}
    ]),
    SharedModule

  ]
})
export class SplitModule { }
