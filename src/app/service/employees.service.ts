import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from '../service/utility.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Employees, POCO } from '../models/employees';
import { ConfigurationService } from './configuration.service';
import { DepartmentService } from './department.service';

@Injectable()
export class EmployeesService {
	private url: string;
	private urlOdata: string;

	constructor(private http: HttpClient,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService,
		private departmentService: DepartmentService) {
		this.url = this.configurationService.baseUrl + '/api/Employee';
		this.urlOdata = this.configurationService.baseUrl + '/api/EmployeeOdata';
	}
	getEmployeePersonalObjectives(employeeId: number) {
		return this.http
			.get(this.url + `/GetEmployeePersonalObjectives?employeeId=${employeeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeeDashboard(employeeId: number, companyId: number) {
		return this.http
			.get(this.configurationService.baseUrl +  `api/EmployeeWidget/GetEmployeeWidget?employeeId=${employeeId}&companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	updateEmployeeDashboard(widgets) {
		return this.http
			.put(this.configurationService.baseUrl +  `api/EmployeeWidget/UpdateEmployeeWidget`, widgets)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	createEmployeeDashboard(widgets) {
		return this.http
			.post(this.configurationService.baseUrl +  `api/EmployeeWidget/PostEmployeeWidget`,  widgets)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeeBusinessObjectives(employeeId: number) {
		return this.http
			.get(this.url + `/GetEmployeeBusinessObjectives?employeeId=${employeeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeePersonalCompetencies(employeeId: number) {
		return this.http
			.get(this.url + `/GetEmployeePersonalCompetencies?employeeId=${employeeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeeReportingToCurrentUser(companyId: number) {
		return this.http
			.get(this.url + `/GetEmployeeReportingToCurrentUser?companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeeReportingToCurrentUserProject(companyId: number) {
		return this.http
			.get(this.url + `/GetEmployeeReportingToCurrentUserProject?companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeesForGeneration(companyId: number, employeeTypeId: number) {
		return this.http
			.get(this.url + `/GetEmployeesForGeneration?companyId=${companyId}&employeeTypeId=${employeeTypeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getOdata(filter) {
		return this.http
			.get(this.urlOdata + `/get?$filter=${filter}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	createEmployee(Employee) {
		return this.http
			.post(this.url + '/PostEmployee?', JSON.stringify(Employee),{withCredentials : true})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	updateEmployee(Employee) {
		return this.http
			.put(this.url + '/PutEmployee?', JSON.stringify(Employee),{withCredentials : true})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeesLazy(companyId, offset, rows, globalFilter) {
		return this.http
			.get(this.url + '/getEmployeesLazy?companyId=' + companyId + '&offset=' + offset + '&rows=' + rows + '&globalFilter=' + globalFilter)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeesTotalRecords(companyId) {
		return this.http
			.get(this.url + '/getEmployeesTotalRecords?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getAllEmployee(companyId) {
		return this.http
			.get(this.url + '/GetEmployeesByCompany?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeeById(EmployeeId) {
		return this.http.get(this.url + '/GetEmployee?id=' + EmployeeId)
			.pipe(catchError(this.utilityService.handleErrorPromise));;
	}

	getActiveEmployees(companyId: number) {
		return this.http
			.get(this.url + '/GetActiveEmployees?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeesByQuery(companyId: number, query: string) {
		return this.http
			.get(this.url + '/GetEmployeesByQuery?companyId=' + companyId + '&query=' + query)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeesInUsernames(companyId: number, usernames: string[]) {
		return this.http
			.post(this.url + '/GetEmployeesInUsernames?companyId=' + companyId, JSON.stringify(usernames))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeesInIds(companyId: number, ids: number[]) {
		return this.http
			.post(this.url + '/GetEmployeesInIds?companyId=' + companyId, JSON.stringify(ids))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getTerminatedEmployees(companyId: number) {
		return this.http
			.get(this.url + '/GetTerminatedEmployees?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	deleteEmployee(EmployeeId) {
		return this.http.delete(this.url + '/DeleteEmployee?id=' + EmployeeId);
	}

	getEmployees(companyId, employeeTypeId) {
		return this.http
			.get(this.url + '/GetEmployees?companyId=' + companyId + '&employeeTypeId=' + employeeTypeId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	

	uploadMasterDataByName = (data: any, companyId: number, name: string) => {
		const urlData = name.toLowerCase() === 'employee' ? `/UploadMasterData?companyId=` + companyId :
			`/UploadChildrenMasterData?childName=${name}&companyId=` + companyId;
		return this.http
			.post(this.url + urlData, JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));

	}

	getEmployeeByUsername() {
		return this.http.get(this.url + '/GetEmployeeByUsername');
	}
	getEmployeesByUsername() {
		return this.http.get(this.url + '/GetEmployeesByUsername')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	isInSystemAdminGroup(employeeId: number) {
		return this.http.get(this.url + `/IsInSystemAdminGroup?employeeId=${employeeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeeByUsernameByCompanyId(username: string, companyId: number) {
		return this.http.get(this.url + '/GetEmployeeByUsernameByCompanyId?username=' + username + '&companyId=' + companyId);
	}
	getEmployeeFile(id: string) {
		return this.http
			.get(this.url + '/GetEmployeeFile?id=' + id, { responseType: 'arraybuffer' })
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	updateEmployeeFile(data: FormData) {
		return this.http.post(this.url + '/UpdateEmployeeFile', data)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	deleteEmployeeFiles(data: any[]) {
		return this.http.post(this.url + '/DeleteEmployeeFiles', JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	deleteEmployeePersonalObjective(data: any) {
		return this.http.post(this.url + '/DeleteEmployeePersonalObjective', JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	updateEmployeePersonalObjective(data: any) {
		return this.http.post(this.url + '/UpdateEmployeePersonalObjective', JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	updateEmployeePersonalObjectives(employeId: number, companyId: number, data: any) {
		return this.http.post(this.url + `/UpdateEmployeePersonalObjectives?employeeId=${employeId}&companyId=${companyId}`, JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeePositionHistory(employeId: number) {
		return this.http.get(this.url + `/GetPositionHistory?employeeId=${employeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeeAutoCodeGenerated(companyId: number) {
		return this.http
			.get(this.url + `/GetAutoGeneratedCode?companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	exportToExcel(employeesIds: number[], companyId: number) {
		return this.http
			.post(this.url + `/ExportToExcel?companyId=${companyId}`, JSON.stringify(employeesIds),{
			responseType: "blob"})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getEmployeeStatusTypes() {
		return this.http
			.get(this.url + '/GetEmployeeStatusTypes')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}


		
	getExcelTemplate(name: string) {
		return this.http
			.get(this.url + `/GetTemplate?name=${name}`,{
			responseType: "blob"})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	GetEmployeePictureBase64(employeId: number) {
		return this.http.get(this.url + `/GetEmployeePictureBase64?employeeId=${employeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}


}
