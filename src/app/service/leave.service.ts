import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError, finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LeaveService {
	public urlLeaveAPI: any;

	constructor(private http: HttpClient,
		private utilityService: UtilityService,
		public ngProgress: NgProgress,
		private configurationService: ConfigurationService) {
		this.urlLeaveAPI = this.configurationService.baseUrl + '/api/Leave';
	}

	//#region Methods
	GetLeave(id) {
		return this.http
			.get(this.urlLeaveAPI + '/GetLeave?id=' + id)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getRenewalLeaveType() {
		return this.http
			.get(this.urlLeaveAPI + '/GetRenewalLeaveType')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	DeleteLeave(id) {
		this.ngProgress.ref().start();
		return this.http
			.delete(this.urlLeaveAPI + '/DeleteLeave?id=' + id)
			.pipe(finalize(() => this.ngProgress.ref().complete()));
	}
	GetLeaveCategories() {
		return this.http
			.get(this.urlLeaveAPI + '/GetLeaveCategories')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getLeaveTypes() {
		return this.http
			.get(this.urlLeaveAPI + '/GetLeaveTypes')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	UpdateLeave(data) {
		this.ngProgress.ref().start();
		return this.http.put(this.urlLeaveAPI + '/PutLeave?', JSON.stringify(data)).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}
	InsertLeave(data) {
		this.ngProgress.ref().start();
		return this.http.post(this.urlLeaveAPI + '/PostLeave?', JSON.stringify(data)).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}
	GetLeaves(companyId) {
		return this.http
			.get(this.urlLeaveAPI + '/GetLeaves?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	//#endregion
}
