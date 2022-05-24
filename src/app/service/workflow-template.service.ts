import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError, finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { ConfigurationService } from './configuration.service';

@Injectable({
	providedIn: 'root'
})
export class WorkflowtemplateService {

	public urlWorkflowtemplateAPI: string;

	constructor(
		private http: HttpClient,
		public ngProgress: NgProgress,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService) {
		this.urlWorkflowtemplateAPI = this.configurationService.baseUrl + '/api/WorkflowTemplate';
	}

	getWorkflowStatuses() {
		return this.http
			.get(this.urlWorkflowtemplateAPI + '/GetWorkflowStatuses')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getWorkflowTemplateTypes() {
		return this.http
			.get(this.urlWorkflowtemplateAPI + '/GetWorkflowTemplateTypes')
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getWorkflowTemplate(id: string) {
		return this.http
			.get(this.urlWorkflowtemplateAPI + '/GetWorkflowTemplate?id=' + id)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getWorkflowTemplates(companyId: number) {
		return this.http
			.get(this.urlWorkflowtemplateAPI + '/GetWorkflowTemplates?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getWorkflowTemplatesByTypeId(companyId: number,typeId:number) {
		return this.http
			.get(this.urlWorkflowtemplateAPI + `/GetWorkflowTemplatesByTypeId?companyId=${companyId}&typeId=${typeId}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	deleteWorkflowTemplate(id: string) {
		this.ngProgress.ref().start();
		return this.http
			.delete(this.urlWorkflowtemplateAPI + '/DeleteWorkflowTemplate?id=' + id)
			.pipe(finalize(() => this.ngProgress.ref().complete()));
	}

	insertWorkflowTemplate(data: any) {
		this.ngProgress.ref().start();
		return this.http.post(this.urlWorkflowtemplateAPI + '/PostWorkflowTemplate?', JSON.stringify(data)).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}

	updateWorkflowTemplate(data: any) {
		this.ngProgress.ref().start();
		return this.http.put(this.urlWorkflowtemplateAPI + '/PutWorkflowTemplate?', JSON.stringify(data)).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}
}
