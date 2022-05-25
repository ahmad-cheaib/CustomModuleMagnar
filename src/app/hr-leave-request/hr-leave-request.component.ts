import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { concat } from "rxjs";
import { takeWhile, tap, filter, finalize } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { CommonMessages } from "../helpers/common.messages";
import { notificationTypeEnums } from "../helpers/enum.helper";
import { FileUploaderButtonComponent } from "../helpers/file-uploader-button/file-uploader-button.component";
import { LeaveBaseComponent } from "../leave-request/leave-base.component";
import { LeaveRequest } from "../models/leaveRequest";
import { ConfigurationService } from "../service/configuration.service";
import { EmployeeLookupService } from "../service/employee-lookup.service";
import { LeaveService } from "../service/leave.service";
import { LeaveRequestService } from "../service/leaveRequest.service";
import { LeaveTransactionsService } from "../service/leaveTransactions.service";
import { LoaderService } from "../service/loader.service";
import { NotificationService } from "../service/notification.service";
import { PermissionManagerService } from "../service/permissionmanager.service";
import { UtilityService } from "../service/utility.service";
import { WorkflowtemplateService } from "../service/workflow-template.service";

@Component({
	selector: 'app-hr-leave-request',
	templateUrl: './hr-leave-request.component.html',
	styleUrls: ['./hr-leave-request.component.scss']
})
export class HrLeaveRequestComponent extends LeaveBaseComponent implements OnInit {

	leaves: any[];
	username: string;
	loading: boolean;
	showHours = false;
	calendarDateFormat: string;
	leaveRequests: LeaveRequest[];
	leaveRequest: any = new LeaveRequest();
	selectedId: number;
	selectedStatus: number;
	uploadedFiles: any[] = [];
	WFBodyMessage: string = "";
	IsWFConfigured: boolean = false;
	WFValidation: string = "";
	isHourDisabled = true;
	private isAnnual = false;
	@ViewChild('fileUploader') fileUploader: FileUploaderButtonComponent;
	@ViewChild('chosenLeave') chosenLeave: ElementRef;
	createdDate: Date;


	constructor(
		private translate : TranslateService,
		private _Router: Router,
		protected datePipe: DatePipe,
		protected _LeaveService: LeaveService,
		private _LoaderService: LoaderService,
		public _UtilityService: UtilityService,
		private _ActivatedRoute: ActivatedRoute,
		private _NotificationService: NotificationService,
		private _LeaveRequestService: LeaveRequestService,
		protected _ConfigurationService: ConfigurationService,
		protected _EmployeeLookupService: EmployeeLookupService,
		protected _WorkflowtemplateService: WorkflowtemplateService,
		private permissionManagerService: PermissionManagerService,
		private _LeaveTransactionsService: LeaveTransactionsService
	) {
		super(datePipe, _LeaveService, _ConfigurationService, _EmployeeLookupService,
			_WorkflowtemplateService);

			translate.setDefaultLang('en');
			translate.use('en');
	}

	ngOnInit() {
		this.loading = true;
		this._LoaderService.displayLoader(true);

		this.organizationId = '1';
		this.companyId = 1;
		this.username = "fsleiman@areeba.com";
		this.employeeId = `179`;

		
		this._ActivatedRoute.params
			.pipe(
				takeWhile(() => !this.isDestroyed),
				tap((params: Params) => {

					this.getDateFormat();
					concat(this.getLeaves(), this.getWorkflowStatuses()).pipe(
						tap(() => this.onChangeEmployee())
					).subscribe();
				})
			).subscribe();

		this.permissionManagerService.permissionManager$.pipe(
			takeWhile(() => !this.isDestroyed),
			tap(() => {
				this._Router.navigate([`${this.organizationId}/${this.companyId}/hr/permissions/company/${this.companyId}/LeaveRequest`]);
			})
		).subscribe();

		this._ActivatedRoute.queryParams.pipe(
			takeWhile(() => !this.isDestroyed),
			tap((params: Params) => {
				this.selectedId = params.id ? Number(params.id) : undefined;
				this.selectedStatus = params.status !== undefined ? Number(params.status) : undefined;
			})
		).subscribe();
	}

	onManagePermissionsClick(){
		this._Router.navigate([`${this.organizationId}/${this.companyId}/hr/permissions/company/${this.companyId}/LeaveRequest`]);
	}

	ngOnDestroy() {
		this.isDestroyed = true;
	}


	onChangeEmployee() {
		if (!isNullOrUndefined(this.employeeId) && !isNullOrUndefined(this.workflowStatuses)) {
			this.getLeaveRequests();
		}
	}
	getAttachmentData(row) {
		if (!isNullOrUndefined(row) && !isNullOrUndefined(row.attachmentType)) {
			this._LeaveRequestService.getLeaveRequestAttachment(row.id)
				.pipe(
					takeWhile(() => !this.isDestroyed),
					filter(response => !isNullOrUndefined(response)),
					tap(response => {
						if (response) {
							var blobData = new Blob([response], { type: row.attachmentType });

							if (blobData.size > 0) {
								let fileattachment = new File([blobData], row.fileName, { type: row.attachmentType })
								row.attachmentData = fileattachment;
								this.uploadedFiles = row.attachmentData;
								this.leaveRequest.attachmentData = fileattachment;
								this.leaveRequest.fileBlob = blobData;

							}


						}
					})
				).subscribe();
		}
	}
	viewFileOnEdit(event) {
		event.preventDefault();
		if (this.leaveRequest.fileBlob != null && this.leaveRequest.fileBlob != undefined) {
			let fileViewerURL = window.URL.createObjectURL(this.leaveRequest.fileBlob);
			const a = document.createElement('a');
			document.body.appendChild(a);
			a.href = fileViewerURL;
			a.target = "_blank";
			a.download = this.leaveRequest.fileName;
			a.click();
			setTimeout(() => {
				window.URL.revokeObjectURL(fileViewerURL);
				document.body.removeChild(a);
			}, 0)
		}
	}
	onShowHours() {
		if (!isNullOrUndefined(this.leaveRequest.fromDate) && !isNullOrUndefined(this.leaveRequest.toDate)) {
			if (this.leaveRequest.fromDate.toDateString() === this.leaveRequest.toDate.toDateString()) {
				//	this.leaveRequest.hours = 8;
				const day = new Date(this.leaveRequest.fromDate).getDay() + 1;
				const hours = 0;
				//console.log("in");
				this._LeaveTransactionsService.getWorkingHours(this.employeeId, day, hours)
					.pipe(finalize(() => this._LoaderService.displayLoader(false)))
					.subscribe(response => {
						if (response) {
							this.leaveRequest.daysCount = this.hoursToDays(response, response);
							this.leaveRequest.hours = response;
						}
						else {
							this.leaveRequest.hours = 0;
							this._NotificationService.error(CommonMessages.CompareHoursErrorMessage, notificationTypeEnums.error.toString());
						}
					},
						() => {
							this._NotificationService.error(CommonMessages.CommonErrorMessage, notificationTypeEnums.error.toString());
						}
					);
				return false;
			}
		}
		this.leaveRequest.hours = 0;
		return true;
	}
	getFormData(object) {

		const capitalize = (s) => {
			if (typeof s !== 'string') return ''
			return s.charAt(0).toUpperCase() + s.slice(1)
		}

		let formData = new FormData();

		Object.keys(object).forEach(key => formData.append(capitalize(key), object[key]));

		return formData;
	}


	onRowEdit(row) {
		this._Router.navigate([`${this.organizationId}/${this.companyId}/hr/leave-create/${row.id}`]);

	}

	onPopupDelete() {
		this._LeaveRequestService.deleteLeaveRequest(this._UtilityService.globalVariables.tempDeleteId)
			.pipe(
				takeWhile(() => !this.isDestroyed),
				filter(response => response !== null && response !== undefined),
				tap(() => {
					this._UtilityService.showDeleteModel = false;
					this._UtilityService.afterDelete();
					this.leaveRequests = this.leaveRequests.filter(e => Number(e.id) !== this._UtilityService.globalVariables.tempDeleteId);
				},
					error => {
						if (isNullOrUndefined(error.error)) {
							this._UtilityService.showErrorMessage(this._UtilityService.translate('GenericErrorMessage'));
						}
						else {
							this._UtilityService.showError(this._UtilityService.translate(error.error));
						}
						this._UtilityService.showDeleteModel = false;
					})
			).subscribe();
	}

	checkEmployeeMapping() {
		if (isNullOrUndefined(this.employeeId)) {
			this._UtilityService.showErrorMessage(this._UtilityService.translate('EmployeeUserMapping'));
			return false;
		}
		else {
			return true;
		}
	}

	
	checkLeaveDays() {
		const fromDate = this.transformDate(this.leaveRequest.fromDate);
		const toDate = this.transformDate(this.leaveRequest.toDate);
		this._LeaveRequestService.getLeaveRequestDays(this.employeeId, fromDate, toDate, this.leaveRequest.leaveId.toString())
			.pipe(finalize(() => this._LoaderService.displayLoader(false)))
			.subscribe(response => {
				if (response) {
					this.checkDate(response);
					this.leaveRequest.daysCount = response;
					this.leaveRequest.leaveName = this.leaves.find(item => item.id === Number(this.leaveRequest.leaveId)).name;
					// const typeId = this.leaves.find(item => item.id === Number(this.leaveRequest.leaveId)).typeId;
					// this.checkGrade(typeId);

				}
				else {
					//this.leaveRequest.toDate = null;
					this.leaveRequest.daysCount = 0;
					//this._NotificationService.error(CommonMessages.LeaveDaysCountErrorMessage, notificationTypeEnums.error.toString());
				}
			});
	}

	checkDate(days) {
		this.showHours = false;
		const fromDate = this.transformDate(this.leaveRequest.fromDate);
		const toDate = this.transformDate(this.leaveRequest.toDate);
		if (!isNullOrUndefined(this.leaveRequest.toDate) && !isNullOrUndefined(this.leaveRequest.fromDate) && days === 1 && fromDate === toDate) {
			this.showHours = true;
		}
		return this.showHours;
	}


	checkLeaveRequest() {
		const year = new Date(this.leaveRequest.fromDate).getFullYear();
		if (this.leaveRequest.leaveId !== null) {
			this._LeaveRequestService.checkLeaveRequest(this.companyId, this.leaveRequest.leaveId.toString(),
				this.leaveRequest.employeeId.toString(), year, this.leaveRequest.daysCount.toString())
				.pipe(finalize(() => this._LoaderService.displayLoader(false)))
				.subscribe(response => {
					if (!response) {
						this.leaveRequest.toDate = null;
						this.leaveRequest.daysCount = 0;
						this._NotificationService.error(CommonMessages.LeaveDaysCountErrorMessage, notificationTypeEnums.error.toString());
					}
				},
					() => {
						this._NotificationService.error(CommonMessages.CommonErrorMessage, notificationTypeEnums.error.toString());
					}
				);
		}
	}

	getLeaveRequests() {
		this._LeaveRequestService.getLeaveRequests(this.companyId, this.employeeId)
			.pipe(
				takeWhile(() => !this.isDestroyed),
				finalize(() => {
					this._LoaderService.displayLoader(false);
					this.loading = false;
				}),
				filter(response => !isNullOrUndefined(response)),
				tap(response => {
					response = response.map(p => {
						p.toDate = new Date(p.toDate);
						p.fromDate = new Date(p.fromDate);
						p.leaveName = this.leaves.find(item => item.id === p.leaveId).name;
						p.statusName = this.workflowStatuses.find(item => item.id === p.status).value;
						// let history = p.approvers.map(p => {
						// 	p.statusName = this.workflowStatuses.find(item => item.id === p.status).value;
						// 	return p;
						// });
						// p.approvers = history;
						return p;
					});
					this.leaveRequests = response;
				}),
				tap(() => {
					if (this.selectedId !== undefined) {
						const selectedExpenses = this.leaveRequests.find(item => item.id === this.selectedId);
						if (selectedExpenses) {
							this.onRowEdit(selectedExpenses);
						}
					}
				}),
				tap(() => {
					if (this.selectedStatus !== undefined) {
						this.leaveRequests = this.leaveRequests.filter(item => item.status === this.selectedStatus);
					}
				})
			).subscribe();
	}

	getEmployeeFromGridRow(event: any) {
		const empId = event.employeeId === 0 ? Number(event.employeeName.value) : event.employeeId;
		event.employeeName.value = event.employeeId = empId;
		return this.employees.find(item => item.id === empId);
	}


	getDateFormat() {
		this.calendarDateFormat = this._ConfigurationService.pCalendarDateFormat;
	}

	hoursToDays(hours: number, workingHours: number) {
		if (hours !== 0 && workingHours !== 0) {
			return Math.abs(hours / workingHours).toFixed(2);
		}
		else {
			return 0;
		}
	}

	transformDate(date) {
		return this.datePipe.transform(date, this._ConfigurationService.gridTransformDateFormat);
	}
	
	onAttachmentClick(row) {
		if (!isNullOrUndefined(row) && !isNullOrUndefined(row.attachmentType)) {
			this._LeaveRequestService.getLeaveRequestAttachment(row.id)
				.pipe(
					takeWhile(() => !this.isDestroyed),
					filter(response => !isNullOrUndefined(response)),
					tap(response => {
						var blobData = new Blob([response], { type: row.attachmentType });
						let fileURL = window.URL.createObjectURL(blobData);

						if (window.navigator.msSaveOrOpenBlob) {
							window.navigator.msSaveOrOpenBlob(blobData, row.fileName);
						} else {

							//window.open(fileURL, '_blank');

							const a = document.createElement('a');
							document.body.appendChild(a);
							a.href = fileURL;
							a.target = "_blank";
							a.download = row.fileName;
							a.click();
							setTimeout(() => {
								window.URL.revokeObjectURL(fileURL);
								document.body.removeChild(a);
							}, 0)
						}
					})
				).subscribe();
		}
	}
	

	onAdd(){
		this._Router.navigate([`/${this.organizationId}/${this.companyId}/hr/leave-create`]);
	}
}
