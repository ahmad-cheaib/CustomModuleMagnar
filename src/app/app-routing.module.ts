import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveRequestComponent } from './leave-request/leaveRequest.component';

const routes: Routes = [
  // {
	// 	path: '',
	// 	pathMatch: 'full',
	// 	redirectTo: 'banks'
	// },
  { path: 'leaveRequest',
  component: LeaveRequestComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
