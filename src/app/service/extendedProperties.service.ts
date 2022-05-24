import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { ConfigurationService } from './configuration.service';
import { catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ExtendedPropertiesService {

	public urlAPI: string;

	constructor(
		private http: HttpClient,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService) {
		this.urlAPI = this.configurationService.baseUrl + '/api/ExtendedProperties';
	}

	getAllByCompany(id, top, skip, orderby, direction) {
		return this.http
			.get(this.urlAPI + `/OdataGet?$orderby=${orderby} ${direction}&$filter=companyId eq ${id}&$top=${top}&$skip=${skip}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	get(id) {
		return this.http
			.get(this.urlAPI + `/Get?id=${id}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	getModel() {
		return this.http
			.get(this.urlAPI + `/GetModel`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
	post(data: any) {
		return this.http.post(this.urlAPI + '/Post', JSON.stringify(data)).pipe(
			catchError(this.utilityService.handleErrorPromise)
		);
	}
	put(data: any) {
		return this.http.put(this.urlAPI + '/Put', JSON.stringify(data)).pipe(
			catchError(this.utilityService.handleErrorPromise)
		);
	}
	delete(id: string) {
		return this.http
			.delete(this.urlAPI + '/delete?id=' + id)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getSections(containerType:string){
		return this.http
			.get(this.urlAPI + `/GetSections?containerType=${containerType}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getByCompany(companyId:number){
		return this.http
			.get(this.urlAPI + '/GetByCompany?companyId=' + companyId)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getBySection(containerId:number, containerType:string, entityName:string, sectionName:string){
		return this.http
			.get(this.urlAPI + `/GetBySection?containerId=${containerId}&containerType=${containerType}&entityName=${entityName}&sectionName=${sectionName}`)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	getByContainer(containerId:number, containerType:string){
		return this.http
			.get(this.urlAPI + '/GetByContainer?containerId=' + containerId+"&containerType="+containerType)
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
}
