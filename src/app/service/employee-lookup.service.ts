import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable({
	providedIn: 'root'
})
export class EmployeeLookupService {

	private urlEmployeeLookup: string;

	constructor(private http: HttpClient,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService) {
		this.urlEmployeeLookup = this.configurationService.baseUrl + '/api/EmployeeLookup';
	}

	getEmployeesLookups(companyId: number) {
		return this.http
			.get(`${this.urlEmployeeLookup}/GetEmployeesLookups?companyId=${companyId}&status=1`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getAllEmployeesLookups(companyId: number) {
		return this.http
			.get(`${this.urlEmployeeLookup}/GetEmployeesLookups?companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeesLookupsByType(companyId: number, employeeTypeId: string, status: number, periodId: string = '0') {
		return this.http
			.get(this.urlEmployeeLookup + `/GetEmployeesLookups?companyId=${companyId}&employeeTypeId=${employeeTypeId}&status=${status}&periodId=${periodId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getOffcycleEmployeesLookupsByType(companyId: number, employeeTypeId: string, status: number, periodId: string = '0') {
		return this.http
			.get(this.urlEmployeeLookup + `/GetOffcycleEmployeesLookups?companyId=${companyId}&employeeTypeId=${employeeTypeId}&status=${status}&periodId=${periodId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
}
