import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()

export class ConfigurationService {

	private configuration: any;

	constructor(private injector: Injector) { }

	async loadConfiguration() {
		let http = this.injector.get(HttpClient);
		const data = await http.get(`http://localhost:1478/api/Organization/GetConfigurations`).toPromise();
	
		this.configuration = Object.assign({}, data); 
		//localStorage.setItem('load_hr', this.configuration.features.ess);
	}

	get baseUrl() {
		return "http://localhost:1478/";
	}

	get reportBaseUrl() {
		return this.configuration.reportBaseUrl;
	}
	get dateFormat() {
		return this.configuration.dateFormat;
	}

	get gridTransformDateFormat() {
		return this.configuration.gridTransformDateFormat;
	}

	get pCalendarDateFormat() {
		return 'dd/mm/yy';
	}

	get dateTimeFormat() {
		return this.configuration.dateTimeFormat;
	}

	get datePipeCulture() {
		return this.configuration.datePipeCulture;
	}

	get reportUrl() {
		return this.configuration.reportUrl;
	}

	get loadHr() {
		//console.log(this.configuration.features.ess);
		return this.configuration.features.ess;
	}

	get authorityUrl() {
		return "http://localhost:1478/";
	}

	get googleSiteKey() {
		return this.configuration.googleSiteKey;
	}
}
