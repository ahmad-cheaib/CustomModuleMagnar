import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError, finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { ConfigurationService } from './configuration.service';
@Injectable()
export class LeaveTransactionsService {

	private url: string;

	constructor(private http: HttpClient,
		private utilityService: UtilityService,
		public ngProgress: NgProgress,
		private configurationService: ConfigurationService) {
		this.url = this.configurationService.baseUrl + '/api/LeaveTransaction';
	}

	getAllLeaveTransactions(companyId, employeeId, fromYear, toYear, fromMonth, toMonth) {
		const fragment = employeeId ? `&employeeId=${employeeId}` : '';
		return this.http
			.get(`${this.url}/GetLeaveTransactions?companyId=${companyId}
			${fragment}
			&fromYear=${fromYear}&toYear=${toYear}&fromMonth=${fromMonth}&toMonth=${toMonth}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getLeaveTransactionsInRange(companyId, startDate,endDate,depIDs){
		return this.http
			.get(`${this.url}/GetLeaveTransactionsInRange?companyId=${companyId}
			&startDate=${startDate}&endDate=${endDate}&depIDs=${depIDs}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}


	exportToExcel(companyId: number, employeeId: number, fromYear: number, toYear: number, fromMonth: number, toMonth: number) {
		return this.http.get(this.url +
			`/ExportToExcel?companyId= ${companyId}&employeeId=${employeeId}&fromYear=${fromYear}&toYear=${toYear}&fromMonth=${fromMonth}&toMonth=${toMonth}`
			, { responseType: 'blob' })
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getLeaveTransaction(id) {
		return this.http
			.get(this.url + '/GetLeaveTransaction?id=' + id)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getPrevWorkingday(employeeId: number, date: any) {
		return this.http
			.get(this.url + `/GetPrevWorkingday?employeeId=${employeeId}&toDate=${date}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getNextWorkingday(employeeId: number, date: any, leaveId: number) {
		return this.http
			.get(this.url + `/GetNextWorkingday?employeeId=${employeeId}&toDate=${date}&leaveId=${leaveId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeeLeaveTransactionRejoin(companyId) {
		return this.http
			.get(this.url + '/getEmployeeLeaveTransactionRejoin?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	updateLeaveTransaction(data: FormData) {
		this.ngProgress.ref().start();
		return this.http.put(this.url + '/PutLeaveTransaction', data, {withCredentials : true}
		).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}

	insertLeaveTransaction(data: FormData) {
		this.ngProgress.ref().start();
		return this.http.post(this.url + '/PostLeaveTransaction', data, {withCredentials : true}
		).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}
	getLeaveTransactionAttachment(id: string) {
		return this.http
			.get(this.url + '/GetLeaveTransactionAttachment?leaveTransactionId=' + id, { responseType: 'arraybuffer' })
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	deleteLeaveTransaction(id) {
		this.ngProgress.ref().start();
		return this.http
			.delete(this.url + '/DeleteLeaveTransaction?id=' + id)
			.pipe(finalize(() => this.ngProgress.ref().complete()));
	}

	getLeaveTransactionDays(employeeId, fromDate, toDate, leaveId) {
		return this.http
			.get(
				this.url +
				'/GetLeaveTransactionDays?employeeId=' +
				employeeId +
				'&fromDate=' +
				fromDate +
				'&toDate=' +
				toDate +
				'&leaveId=' +
				leaveId
			)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getLeaveTransactionGradeDays(companyId, leaveId, employeeId, year, daysCount) {
		return this.http
			.get(
				this.url +
				'/GetLeaveTransactionGradeDays?companyId=' +
				companyId +
				'&leaveId=' +
				leaveId +
				'&employeeId=' +
				employeeId +
				'&year=' +
				year +
				'&daysCount=' +
				daysCount
			)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	checkLeaveTransaction(companyId, leaveId, employeeId, year, daysCount) {
		return this.http
			.get(
				this.url +
				'/CheckLeaveTransaction?companyId=' +
				companyId +
				'&leaveId=' +
				leaveId +
				'&employeeId=' +
				employeeId +
				'&year=' +
				year +
				'&daysCount=' +
				daysCount
			)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getLeaveTransactionEmployeeLeaves(employeeId, fromYear, daysCount) {
		return this.http
			.get(
				this.url +
				'/GetLeaveTransactionEmployeeLeaves?employeeId=' +
				employeeId +
				'&fromYear=' +
				fromYear +
				'&daysCount=' +
				daysCount
			)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getWorkingHours(employeeId, day, hours) {
		return this.http
			.get(this.url + '/GetWorkingHours?employeeId=' + employeeId + '&day=' + day + '&hours=' + hours)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
}
