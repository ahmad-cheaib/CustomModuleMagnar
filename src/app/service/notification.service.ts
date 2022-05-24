import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {
	constructor(private toastr: ToastrService, private translateService: TranslateService) {}

	public success = (body: string, title = 'Operation successful'): void => {
		this.toastr.success( body, title);
	};

	public error = (body: string, title = 'An error occured'): void => {
		this.toastr.error(body === "" ? title : body , title);
	};

	public warning = (body: string): void => {
		this.toastr.warning( body);
	};

	public info = (messageKey: string, titleKey: string = 'notifications.NoticeTitle'): void => {
		this.toastr.info(messageKey, titleKey);
	};

	public completedSuccessfully = (
		messageKey: string = 'notifications.SuccessMessage',
		titleKey: string = 'notifications.SuccessTitle'
	): void => {
		this.success(messageKey, titleKey);
	};

	public failure = (
		messageKey: string = 'notifications.ErrorMessage',
		titleKey: string = 'notifications.ErrorTitle'
	): void => {
		this.error(messageKey, titleKey);
	};

}
