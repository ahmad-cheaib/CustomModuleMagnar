import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { UtilityService } from './utility.service';



@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  public urlLeaveRequestAPI: string;

	constructor(
		private _Http: HttpClient,
		private _UtilityService: UtilityService,
		) {
		this.urlLeaveRequestAPI = 'http://localhost:1478/api/LeaveRequest';
	}

 

    GetLeaves() {
      return this._Http.get("http://localhost:1478/api/Leave/GetLeaves?companyId=1").pipe();
    }
    
    getById(id: number) {
      return this._Http
        .get(this.urlLeaveRequestAPI + '/GetById?id=' + id)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
    getLeaveRequest(id: string) {
      return this._Http
        .get(this.urlLeaveRequestAPI + '/GetLeaveRequest?id=' + id)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
    getLeaveRequestAttachment(id: string) {
      return this._Http
        .get(this.urlLeaveRequestAPI + '/GetLeaveRequestAttachment?leaveRequestId=' + id, { responseType: 'arraybuffer' })
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
  
  
    getLeaveRequests(companyId: number, employeeId: string) {
      return this._Http
        .get(`${this.urlLeaveRequestAPI}/GetLeaveRequests?companyId=${companyId}&employeeId=${employeeId}`)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
  
    getLeaveRequestsByUsername(companyId: number) {
      return this._Http
        .get(`${this.urlLeaveRequestAPI}/GetLeaveRequestsByUsername?companyId=${companyId}`)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }

    getLeaveRequestsForApproval(statusId: string,companyId:number) {
      return this._Http
        .get(`${this.urlLeaveRequestAPI}/GetLeaveRequestsForApproval?status=${statusId}&companyId=${companyId}`)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
  
    getLeaveRequestDays(employeeId: string, fromDate: string, toDate: string, leaveId: string) {
      return this._Http
        .get(this.urlLeaveRequestAPI + '/GetLeaveRequestDays?employeeId=' + employeeId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&leaveId=' + leaveId)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
  
    getLeaveRequestGradeDays(companyId, leaveId, employeeId, year, daysCount) {
      return this._Http
        .get(this.urlLeaveRequestAPI + '/GetLeaveRequestGradeDays?companyId=' + companyId + '&leaveId=' + leaveId + '&employeeId=' +
          employeeId + '&year=' + year + '&daysCount=' + daysCount)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
  
    checkLeaveRequest(companyId: number, leaveId: string, employeeId: string, year: string | number, daysCount: string) {
      return this._Http
        .get(this.urlLeaveRequestAPI + '/CheckLeaveRequest?companyId=' + companyId + '&leaveId=' + leaveId + '&employeeId=' + employeeId +
          '&year=' + year + '&daysCount=' + daysCount)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
  
    updateLeaveRequest(data: FormData) {
      return this._Http.put(this.urlLeaveRequestAPI + '/PutLeaveRequest', data, {withCredentials : true}).pipe(
        catchError(this._UtilityService.handleErrorPromise)
      );
    }
  
    insertLeaveRequest(data: FormData) {
      return this._Http.post(this.urlLeaveRequestAPI + '/PostLeaveRequest', data, {withCredentials : true}).pipe(
        catchError(this._UtilityService.handleErrorPromise)
      );
    }
  
    deleteLeaveRequest(id) {
      return this._Http.delete(this.urlLeaveRequestAPI + '/DeleteLeaveRequest?id=' + id)
        .pipe(  catchError(this._UtilityService.handleErrorPromise));
    }
  
    validateWFConfig(companyId:number,leaveId:number) {
      return this._Http
        .get(`${this.urlLeaveRequestAPI}/ValidatePreRequestCreation?companyId=${companyId}&leaveId=${leaveId}`)
        .pipe(catchError(this._UtilityService.handleErrorPromise));
    }
}
