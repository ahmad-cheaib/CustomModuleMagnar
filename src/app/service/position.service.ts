import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError, finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PositionService {


	public urlPositionAPI: string;
	public urlDivisionAPI: string;
	public urlDepartmentAPI: string;
	public urlUnitAPI: string;

	constructor(
		private http: HttpClient,
		public ngProgress: NgProgress,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService) {
		this.urlPositionAPI = this.configurationService.baseUrl + '/api/Position';
		this.urlDivisionAPI = this.configurationService.baseUrl + '/api/Division';
		this.urlDepartmentAPI = this.configurationService.baseUrl + '/api/Department';
		this.urlUnitAPI = this.configurationService.baseUrl + '/api/Unit';
	}

	getPosition(id: string) {
		return this.http
			.get(this.urlPositionAPI + '/GetPosition?id=' + id)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getEmployeeInPosition(id: number) {
		return this.http
			.get(this.urlPositionAPI + '/GetEmployeeInPosition?id=' + id)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getPositions(companyId: number) {
		return this.http
			.get(this.urlPositionAPI + '/GetPositionsByCompanyId?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getPositionsAssignments(companyId: number) {
		return this.http
			.get(this.urlPositionAPI + '/GetPositionsAssignmentsByCompanyId?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	GetPositionsAssignmentsChartByCompanyId(companyId: number) {
		return this.http
			.get(this.urlPositionAPI + '/GetPositionsAssignmentsChartByCompanyId?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}


	deletePosition(id: string) {
		this.ngProgress.ref().start();
		return this.http
			.delete(this.urlPositionAPI + '/DeletePosition?id=' + id)
			.pipe(finalize(() => this.ngProgress.ref().complete()));
	}

	insertPosition(data: any) {
		this.ngProgress.ref().start();
		return this.http.post(this.urlPositionAPI + '/PostPosition?', JSON.stringify(data)).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}
	PostPositionWithNumber(data: any, count: number) {
		this.ngProgress.ref().start();
		return this.http.post(this.urlPositionAPI + '/PostPositionWithNumber?', JSON.stringify({ "Position": data, "Count": count })).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}

	updatePosition(data: any) {
		this.ngProgress.ref().start();
		return this.http.put(this.urlPositionAPI + '/PutPosition?', JSON.stringify(data)).pipe(
			finalize(() => this.ngProgress.ref().complete()),
			catchError(this.utilityService.handleErrorPromise)
		);
	}

	downloadTemplate() {
		return this.http
			.get(this.urlPositionAPI + `/DownloadJobTemplate`, {
				responseType: 'blob',
			})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	uploadData = (data: any, companyId: number) => {
		return this.http
			.post(this.urlPositionAPI + `/ImportData?companyId=${companyId}`, JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	};

	

	uploadMasterDataByName = (data: any, companyId: number, name: string) => {
		const urlData = `/UploadMasterData?companyId=` + companyId
		return this.http
			.post(this.urlPositionAPI + urlData, JSON.stringify(data))
			.pipe(catchError(this.utilityService.handleErrorPromise));
	};

}
