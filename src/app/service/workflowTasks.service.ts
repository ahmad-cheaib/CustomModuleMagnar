import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class WorkflowTaskService {
	public baseUrl: any;


	constructor(private http: HttpClient,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService) {
		this.baseUrl = this.configurationService.baseUrl + '/api/WorkflowTasks';
	}

	getTasks(index: number, count: number, status: number, companyId: number) {
		return this.http.get(this.baseUrl + `/GetTasks?index=${index}&count=${count}&status=${status}&companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getTasksByType(index: number, count: number, taskType: number, status: number, companyId: number) {
		return this.http.get(this.baseUrl + `/GetTasksByType?index=${index}&count=${count}&status=${status}&taskType=${taskType}&companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	GetTasksAppraisal(status: number, companyId: number) {
		return this.http.get(this.baseUrl + `/GetTasksAppraisal?companyId=${companyId}&status=${status}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getApproversHistory(instanceId: string, itemId: number, companyId: number, workflowDefinitionId: number) {
		return this.http.get(this.baseUrl + `/GetApproversHistory?instanceId=${instanceId}&itemId=${itemId}&workflowDefinitionId=${workflowDefinitionId}&companyId=${companyId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getTask(id: number) {
		return this.http.get(this.baseUrl + `/GetTaskById?id=${id}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getTasksByInstanceId(instanceId: any) {
		return this.http.get(this.baseUrl + `/GetTasksByInstanceId?instanceId=${instanceId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getWorkflowInstanceData(instanceId: any) {
		return this.http.get(this.baseUrl + `/GetWorkflowInstanceData?instanceId=${instanceId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	public getRequests(status: number, companyId: number,allRecords : boolean): Observable<any> {
		return this.http.get(`${this.baseUrl}/GetRequestsByStatus?status=${status}&companyId=${companyId}&allRecords=${allRecords}`).pipe(
			catchError(this.utilityService.handleErrorPromise)
		);
	}

	public getRequestCount(status: number, companyId: number): Observable<any> {
		return this.http.get(`${this.baseUrl}/GetRequestsCount?status=${status}&companyId=${companyId}`).pipe(
			catchError(this.utilityService.handleErrorPromise)
		);
	}
}
