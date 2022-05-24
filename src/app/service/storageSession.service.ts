import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class StorageSessionService {
	private url: string;

	constructor(private http: HttpClient,
		private utilityService : UtilityService,
		private configurationService: ConfigurationService) {
		this.url = this.configurationService.baseUrl + '/api/SessionStorage';
	}

	addsessionData(data : any) {
		return this.http
			.post(this.url + '/AddSessionData', data,{withCredentials : true})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}

	addsessionStringData(data : any) {
		return this.http
			.post(this.url + '/AddSessionStringData', data,{withCredentials : true})
			.pipe(catchError(this.utilityService.handleErrorPromise));
	}
}
