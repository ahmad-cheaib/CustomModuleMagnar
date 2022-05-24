import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError } from 'rxjs/operators';
import { Department } from '../models/department';
import { ConfigurationService } from './configuration.service';
@Injectable()
export class DepartmentService {
	private url: string;
	public departments: Department[];
	public department = new Department();
	public orgcompany: any;

	constructor(private http: HttpClient, 
		private utilityService: UtilityService,
		private configurationService: ConfigurationService) {
		this.url = this.configurationService.baseUrl + '/api/Department';
	}

	getDepartment(departmentId) {
		return this.http
			.get(this.url + '/GetDepartment?id=' + departmentId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	createDepartment(department) {
		return this.http
			.post(this.url + '/PostDepartment?', JSON.stringify(department))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	updateDepartment(department) {
		return this.http
			.put(this.url + '/PutDepartment?', JSON.stringify(department))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	deleteDepartment(departmentId) {
		return this.http.delete(this.url + '/DeleteDepartment?id=' + departmentId)
		.pipe(catchError(this.utilityService.handleErrorPromise));
	}
}
