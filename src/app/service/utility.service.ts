import { Injectable } from '@angular/core';
import { throwError, Observable, never, Subject, BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { catchError, take, takeWhile, tap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import * as moment_ from 'moment';
const moment = moment_;
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { GlobalVariables } from '../models/GlobalVariables';
import { LoaderService } from './loader.service';

@Injectable({
	providedIn: 'root'
})
export class UtilityService {
	monthName = 'elements.ProvisionPayments.Month';
	public globalVariables = new GlobalVariables();
	showDeleteModel = false;
	public isReport = false;
	public static calendarDateFormat = 'dd/mm/yy';
	public years: any[];
	public years$: Subject<any[]> = new BehaviorSubject([]);
	public renderSelect2$: Subject<boolean> = new BehaviorSubject(true);

	constructor(
		private datePipe: DatePipe,
		private _Router: Router,
		private http: HttpClient,
		private laoderService: LoaderService,
		private location: Location,
		@Inject(DOCUMENT) private document: Document) { }

	handleErrorPromise = (error: any): Observable<any> => {
		
		if (error.status !== null && error.status === 406) {
			if (error.error) {
				return throwError(error.error);
			}
			else {
				return throwError(error.statusText);
			}
		}
		else if (error.error !== null && error.error.text) {
			const errorText = (typeof error.error.text) === 'string' ? error.error.text : error.statusText;
			return throwError(errorText);
		}
		else if (error.error) {
			const splitter = !isNullOrUndefined(error.error.split) ? error.error.split(';') : '';
			let myError = error.error;
			if (splitter.length > 1) {
				myError = splitter[0];
			}
			let errorMessageTranslated = '';
			if ((typeof myError) === 'string') {
				errorMessageTranslated = myError;
			}
			if (errorMessageTranslated === myError) {
				// not translated
				errorMessageTranslated = 'GenericErrorMessage';
			}
			return throwError(myError);
		} else {
			try {
				error = JSON.parse(error._body);
			} catch (e) { }

			const errMsg = error.error ? error.error : error.errorMessage
				? error.errorMessage
				: error.message
					? error.message
					: error._body
						? error._body
						: error.status
							? `${error.status} - ${error.statusText}`
							: 'unknown server error';

			console.error(errMsg);
			this.laoderService.displayLoader(false);
			return throwError(errMsg);
		}
	}

	public displayFieldCss(form: FormGroup, field: string, spanError: boolean) {
		if (!form || !form.get(field)) {
			return true;
		}
		if (spanError) {
			return {
				accepted: !this.isFieldValid(form, field),
				rejected: this.isFieldValid(form, field)
			};
		} else {
			return {
				'has-success': !this.isFieldValid(form, field),
				'has-error': this.isFieldValid(form, field)
			};
		}
	}

	public validateAllFormFields(formGroup: FormGroup) {
		if (!formGroup) {
			return true;
		}
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	public resetForm(formGroup: FormGroup) {
		let control: AbstractControl = null;
		formGroup.reset();
		formGroup.markAsUntouched();
		Object.keys(formGroup.controls).forEach((name) => {
			control = formGroup.controls[name];
			control.setErrors(null);
		});
	}

	public isFieldValid(form: FormGroup, field: string) {
		if (!form || !form.get(field)) {
			return true;
		}
		return !form.get(field).valid &&
			form.get(field).touched;
	}

	getMonths() {
		let months: SelectItem[] = [{ label: '0', value: 0 }];
		for (let i = 1; i < 13; i++) {
			months.push({ label: (i).toString(), value: i });
		}
		return months;
	}
	getMonthID(id: string) {
		return this.monthName + id;
	}
	checkIfNew(data, Id) {
		if (Id === '0' || Id === '+' || Id === data[data.length - 1].id) {
			return true;
		}
		return false;
	}

	

	onRowDelete(Id) {
		this.globalVariables.tempDeleteId = Id;
		this.showDeleteModel = true;
	}

	onPopupClose() {
		this.showDeleteModel = false;
	}

	onUserConfirm() {
		this.showDeleteModel = false;
		this._Router.navigateByUrl('/login');
	}

	afterDelete() {
		'Success';

	}
	afterDeleteFailure() {
		'Error'

	}
	showError(error: string) {
		if (error) {
			if (error === 'CodeCheckerMessage') {
					'Error';
			}
			else {
				'Error'
			}
		}
		else {
			'Error'
		}

	}
	showSuccess() {
		'success'
	}

	showCommonError() {
		'success'
	}
	showErrorMessage(error: string) {
		'Error'
	}
	onShowReport() {
		this.isReport = true;
	}
	onHideReport() {
		this.isReport = false;
	}


	uploadMasterData = (url: string, data: any, companyId: number, organizationId: number) => {
		return this.http
			.post(url + `/UploadMasterData?companyId=${companyId}&organizationId=${organizationId}`,
				JSON.stringify(data))
			.pipe(catchError(this.handleErrorPromise));

	}


	translate(value) {
		return (value);
	}

	public updateYears(years: any[]) {
		this.years$.next(years);
	}
	public static formatBackendDate(dateToFormat): String {
		const parsedDate = Date.parse(dateToFormat);
		if (!dateToFormat || dateToFormat === '') {
			return dateToFormat;
		}
		const date = isNaN(parsedDate) ? moment(dateToFormat).toDate() : new Date(dateToFormat);
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
		let d = date.toISOString().replace('Z', '').split("T")[0];
		return d + "T00:00:00";
	}

	public static getFormData(object) {
		const capitalize = (s) => {
			if (typeof s !== 'string') return ''
			return s.charAt(0).toUpperCase() + s.slice(1)
		}
		let formData = new FormData();
		Object.keys(object).forEach(key => {
			if (!isNullOrUndefined(object[key])) {
				formData.append(capitalize(key), object[key])
			}
		}
		);
		return formData;
	}

	public static createFormData(object: Object, form?: FormData, namespace?: string): FormData {
		const formData = form || new FormData();
		for (let property in object) {
			if (!object.hasOwnProperty(property) || !object[property]) {
				continue;
			}
			const formKey = namespace ? `${namespace}[${property}]` : property;
			if (object[property] instanceof Date) {
				formData.append(formKey, object[property].toISOString());
			} else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
				UtilityService.createFormData(object[property], formData, formKey);
			} else {
				formData.append(formKey, object[property]);
			}
		}
		return formData;
	}

	public static addTimeZoneToDate(date): Date {
		const parsedDate = Date.parse(date);
		if (isNullOrUndefined(date) || date === '') {
			return date;
		}
		const newDate = isNaN(parsedDate) ? moment(date).toDate() : new Date(date);
		newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
		return newDate;

	}

	public static removeTimeZoneFromDate(date): Date {
		const parsedDate = Date.parse(date);
		if (isNullOrUndefined(date) || date === '') {
			return date;
		}
		const newDate = isNaN(parsedDate) ? moment(date).toDate() : new Date(date);
		newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
		return newDate;

	}

	public transformDate(date) {
		return this.datePipe.transform(date, 'yyyy/MM/dd');
	}

	public transformDate2(date) {
		return this.datePipe.transform(date, 'dd/MM/yyyy');
	}

	public findString(array: any[], expression, key) {
		let findresult = array.find(expression);
		return isNullOrUndefined(findresult) ? "" : findresult[key];
	}

	goBack(){
		this.location.back();
	}

	

	

	changeCssFile(lang: string) {
		let headTag = this.document.getElementsByTagName(
			"head"
		)[0] as HTMLHeadElement;
		let existingLink = this.document.getElementById(
			"langCss"
		) as HTMLLinkElement;

		let bootstrapExistingLink = this.document.getElementById(
			"bootstrapLangCss"
		) as HTMLLinkElement;

		let appExistingLink = this.document.getElementById(
			"appLangCss"
		) as HTMLLinkElement;


		if (existingLink) {
			existingLink.href = lang === "ar" ? "assets/css/main_ar.css" : "assets/css/main.css";
		} else {
			let newLink = this.document.createElement("link");
			newLink.rel = "stylesheet";
			newLink.type = "text/css";
			newLink.id = "langCss";
			newLink.href = lang === "ar" ? "assets/css/main_ar.css" : "assets/css/main.css";
			headTag.appendChild(newLink);
		}

		

		if (bootstrapExistingLink) {
			bootstrapExistingLink.href = lang === "ar" ? "assets/css/bootstrap_ar.css" : "assets/css/bootstrap.css";
		} else {
			let newLink = this.document.createElement("link");
			newLink.rel = "stylesheet";
			newLink.type = "text/css";
			newLink.id = "bootstrapLangCss";
			newLink.href =  lang === "ar" ? "assets/css/bootstrap_ar.css" : "assets/css/bootstrap.css";
			headTag.appendChild(newLink);
		}

	

		
		if (appExistingLink) {
			appExistingLink.href = lang === "ar" ? "assets/css/app_ar.css" : "assets/css/app.css";
		} else {
			let newLink = this.document.createElement("link");
			newLink.rel = "stylesheet";
			newLink.type = "text/css";
			newLink.id = "appLangCss";
			newLink.href = lang === "ar" ? "assets/css/app_ar.css" : "assets/css/app.css";
			headTag.appendChild(newLink);
		}
	}
}
