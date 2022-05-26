import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { filter, finalize, takeWhile, tap } from 'rxjs/operators';
import { concat } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LeaveBaseComponent } from './leave-base.component';
import { LeaveRequest } from '../models/leaveRequest';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { ConfigurationService } from '../service/configuration.service';
import { EmployeeLookupService } from '../service/employee-lookup.service';
import { LeaveRequestService } from '../service/leaveRequest.service';
import { LoaderService } from '../service/loader.service';
import { UtilityService } from '../service/utility.service';
import { WorkflowtemplateService } from '../service/workflow-template.service';
import { PermissionManagerService } from '../service/permissionmanager.service';
import { LeaveTransactionsService } from '../service/leaveTransactions.service';
import { CommonMessages } from '../helpers/common.messages';
import { notificationTypeEnums } from '../helpers/enum.helper';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FileUploaderButtonComponent } from '../helpers/file-uploader-button/file-uploader-button.component';
import { NotificationService } from '../service/notification.service';
import { EmployeesService } from '../service/employees.service';
import { ThrowStmt } from '@angular/compiler';
import { PositionService } from '../service/position.service';


@Component({
	selector: 'app-leaveRequest',
	templateUrl: './leaveRequest.component.html',
	styleUrls: ['./leaveRequest.component.css'],
	providers: [
		LeaveRequestService,
		EmployeeLookupService,
		WorkflowtemplateService,
		PermissionManagerService,
		LeaveTransactionsService]

})
export class LeaveRequestComponent extends LeaveBaseComponent implements OnInit {

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
	// @ViewChild('chosenLeave') chosenLeave: ElementRef;
	createdDate: Date;
	id: number;
	isLoading: boolean;
	options = [{ label: 'Off', value: false }, { label: 'On', value: true }];

	extendedProperties: any = {};
	leaveId: number;
	requestForm: FormGroup;
	formLeaveId: string;

	myGroup = new FormGroup({

		fromDate: new FormControl(),
		toDate: new FormControl()

	})
	activeEmployees: any;

	data: any[] = [];
	dataLoaded: boolean;
	maxChildrenNum: number = 0;
	mainRootId: number = 0;
	mainRoot: any;
	finalEmpList: any[] = [];
	selectedEmployee: any;





	constructor(
		private _PositionService: PositionService,
		private translate: TranslateService,
		private _Router: Router,
		protected datePipe: DatePipe,
		private _LoaderService: LoaderService,
		public _UtilityService: UtilityService,
		private _ActivatedRoute: ActivatedRoute,
		private _LeaveRequestService: LeaveRequestService,
		protected _ConfigurationService: ConfigurationService,
		protected _EmployeeLookupService: EmployeeLookupService,
		protected _WorkflowtemplateService: WorkflowtemplateService,
		private permissionManagerService: PermissionManagerService,
		private _LeaveTransactionsService: LeaveTransactionsService,
		private _NotificationService: NotificationService,
		private _EmployeesService: EmployeesService
	) {


		super(datePipe, _LeaveRequestService, _ConfigurationService, _EmployeeLookupService,
			_WorkflowtemplateService);

		translate.setDefaultLang('en');
		translate.use('en');
	}

	ngOnInit() {

		// this.getActiveEmployees();

		this.myGroup.get("fromDate").valueChanges.subscribe(selectedValue => {
			this.leaveRequest.fromDate = selectedValue;
			this.getWorkingDays();
		})

		this.myGroup.get("toDate").valueChanges.subscribe(selectedValue => {
			this.leaveRequest.toDate = selectedValue;
			this.getWorkingDays();
		})



		this.loading = true;
		this._LoaderService.displayLoader(true);


		this._ActivatedRoute.params
			.pipe(
				takeWhile(() => !this.isDestroyed),
				tap((params: Params) => {

					const result = this._Router.routerState.snapshot.url.split('/').pop();
					if (parseInt(result)) {
						this.id = Number(result);
					}
					this.getDateFormat();
					this.extendedProperties = {};

					if (!this.id) {

						concat(this.getPositions(),this.getLeaves(), this.getWorkflowStatuses()).subscribe();
						this.initializeLeaveRequest();

					} else {
						concat(this.getPositions(),this.getLeaves(), this.getWorkflowStatuses(), this.getLeaveRequest(this.id)).subscribe();
					}

				})
			).subscribe();

		this.permissionManagerService.permissionManager$.pipe(
			takeWhile(() => !this.isDestroyed),
			tap(() => {
				this._Router.navigate([`permissions/company/${this.companyId}/LeaveRequest`], { relativeTo: this._ActivatedRoute.parent });
			})
		).subscribe();


	}



	getLeaveRequest(id) {
		return this._LeaveRequestService.getById(id).pipe(
			finalize(() => this._LoaderService.displayLoader(false)),
			tap(res => {
				this.leaveRequest = new LeaveRequest();
				this.leaveRequest.id = res.id;
				this.leaveRequest.workflowInstanceId = res.workflowInstanceId;
				this.leaveRequest.hours = res.hours;
				this.leaveRequest.status = res.status;
				this.leaveRequest.toDate = new Date(res.toDate);
				this.leaveRequest.remarks = res.remarks;
				this.leaveRequest.fromDate = new Date(res.fromDate);
				this.leaveRequest.daysCount = res.daysCount;
				this.leaveRequest.leaveId = Number(res.leaveId);
				this.leaveRequest.companyId = Number(res.companyId);
				this.leaveRequest.employeeId = Number(res.employeeId);
				this.leaveRequest.leaveName = this.leaves.find(item => item.id === res.leaveId).value;
				this.leaveRequest.statusName = this.workflowStatuses.find(item => item.id === res.status).value;

				this.leaveRequest.fileName = res.fileName;

				this.createdDate = new Date(res.creationDate);


				this.leaveRequest.attachmentType = res.attachmentType;
				this.getAttachmentData(res);
				this.leaveRequest.offCycle = res.offCycle;
				let currentLeave = this.leaves.find(l => l.id == this.leaveRequest.leaveId);
				this.isAnnual = currentLeave.isAnnual;

				this.extendedProperties = !!res.extendedProperties ? JSON.parse(res.extendedProperties) : {};

				this.employeeId = this.leaveRequest.employeeId;

				this.myGroup.get("fromDate").setValue(this.leaveRequest.fromDate);
				this.myGroup.get("toDate").setValue(this.leaveRequest.toDate);
				
				this.selectedEmployee  = this.finalEmpList.find(e => e.employeeId === this.employeeId );

			})
		)
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

	onManagePermissionsClick() {
		this._Router.navigate([`permissions/company/${this.companyId}/LeaveRequest`], { relativeTo: this._ActivatedRoute.parent });
	}

	ngOnDestroy() {
		this.isDestroyed = true;
	}

	onAbortWF() {
		this.IsWFConfigured = false;
		this.showHideLeaveRequestForm(false);
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

				this._LeaveTransactionsService.getWorkingHours(this.employeeId, day, hours)
					.pipe(finalize(() => this._LoaderService.displayLoader(false)))
					.subscribe(response => {
						if (response) {
							this.leaveRequest.daysCount = this.hoursToDays(response, response);
							this.leaveRequest.hours = response;

						}
						else {
							this.leaveRequest.hours = 0;
						}
					},
						() => {
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
	onSaveChanges() {


		if (this.checkRow()) {

			const payload = Object.assign({}, this.leaveRequest);

			payload.fromDate = UtilityService.formatBackendDate(this.leaveRequest.fromDate);
			payload.toDate = UtilityService.formatBackendDate(this.leaveRequest.toDate);

			payload.extendedProperties = JSON.stringify(this.extendedProperties);

			if (this.fileUploader.fileGuid) {
				payload.fileGuid = this.fileUploader.fileGuid;
				payload.fileName = this.fileUploader.fileName;
				payload.attachmentType = this.fileUploader.fileType;
			}

			this.saveLeaveRequest(payload);
		}
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

	initializeLeaveRequest() {
		this.leaveRequest = new LeaveRequest();
		this.leaveRequest.id = 0;
		this.leaveRequest.hours = 0;
		this.leaveRequest.status = 1;
		this.leaveRequest.daysCount = 0;
		this.leaveRequest.leaveId = null;
		this.leaveRequest.companyId = Number(this.companyId);
		this.leaveRequest.employeeId = Number(this.employeeId);
		this.leaveRequest.statusName = "In Progress";
		this.leaveRequest.offCycle = false;
		this.uploadedFiles = null;
		this.isAnnual = false;
		this.createdDate = new Date();
		this._LoaderService.displayLoader(false);
	}

	showHideLeaveRequestForm(isSave: boolean) {
		if (isSave === false) {
			this._Router.navigate([`/1/1/hr/Leave-Request`]);
			// this._UtilityService.goBack();
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

				}
				else {
					this.leaveRequest.daysCount = 0;
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
					}
				},
					() => {
					}
				);
		}
	}

	checkRow() {
		if (isNullOrUndefined(this.leaveRequest.fromDate)) {
			return false;
		}

		if (isNullOrUndefined(this.leaveRequest.toDate)) {
			return false;
		}

		if (this.leaveRequest.fromDate > this.leaveRequest.toDate) {
			return false;
		}

		if (this.leaves === null || this.leaves.length === 0) {
			return false;
		}

		if (this.leaveRequest.leaveId === null) {
			return false;
		}
		let fromDate = UtilityService.formatBackendDate(this.leaveRequest.fromDate);
		let toDate = UtilityService.formatBackendDate(this.leaveRequest.toDate);

		if (fromDate == toDate) {
			if (this.leaveRequest.hours === 0) {
				return false;
			}
			if (this.leaveRequest.hours > 24) {
				return false;
			}
		}
		return true;
	}


	validateWFConfig(leaveId) {

		this._LeaveRequestService.validateWFConfig(this.companyId, leaveId).pipe(
			takeWhile(() => !this.isDestroyed),
			tap((res) => {
				if (!isNullOrUndefined(res)) {
					this.WFValidation = res.message;
					this.IsWFConfigured = true;
					if (!isNullOrUndefined(res.result) && res.result.length > 0) {

						let msg = ""
						res.result.forEach((element, index) => {
							if (index == 0) {
								msg += element.name;
							}
							// msg += "," + element.name;
						});
						this.WFBodyMessage = msg;

					}
				}
			},
				error => {

					// this.chosenLeave.nativeElement.value = null;
					this.leaveRequest.leaveId = null;
				})
		).subscribe();
	}

	getWorkingDays() {


		if (!isNullOrUndefined(this.leaveRequest.fromDate) && !isNullOrUndefined(this.leaveRequest.toDate)) {
			if (this.leaveRequest.fromDate > this.leaveRequest.toDate) {
				this.leaveRequest.toDate = null;
			}
			else {
				if (!isNullOrUndefined(this.leaveRequest.leaveId)) {
					this.checkLeaveDays();
					this.isHourDisabled = this.onShowHours();
				}
			}
		}
		//enable offcyle checkbox if leave is annual
		if (this.leaveRequest.leaveId) {
			let currentLeave = this.leaves.find(l => l.id == this.leaveRequest.leaveId);

			this.isAnnual = currentLeave.isAnnual;

			if (this.isAnnual === false) {
				this.leaveRequest.offCycle = false;
			}


		}

	}

	validateRequestCreation(leaveId) {

		if (leaveId > 0) {
			this.validateWFConfig(leaveId);
		}
	}

	getLeaveRequestGradeDays() {
		const year = new Date(this.leaveRequest.fromDate).getFullYear();
		if (this.leaveRequest.leaveId !== null && !isNullOrUndefined(this.leaveRequest.fromDate) && !isNullOrUndefined(this.leaveRequest.toDate) && this.leaveRequest.employeeId !== 0) {
			this._LeaveRequestService.getLeaveRequestGradeDays(this.companyId, this.leaveRequest.leaveId, this.leaveRequest.employeeId, year, this.leaveRequest.daysCount)
				.pipe(finalize(() => this._LoaderService.displayLoader(false)))
				.subscribe(response => {
					if (!response) {
						this.leaveRequest.toDate = null;
						this.leaveRequest.daysCount = 0;
					}
				},
					() => {
					}
				);
		}
		else {
			this.leaveRequest.leaveId = null;
		}
	}

	getSelectedDayWorkingHours() {

		const day = new Date(this.leaveRequest.fromDate).getDay() + 1;
		const hours = this.leaveRequest.hours;
		this._LeaveTransactionsService.getWorkingHours(this.employeeId, day, hours)
			.pipe(finalize(() => this._LoaderService.displayLoader(false)))
			.subscribe(response => {
				if (response) {
					this.leaveRequest.daysCount = this.hoursToDays(hours, response);
				}
				else {
					this.leaveRequest.hours = 0;
				}
			},
				() => {
				}
			);

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
		return this.datePipe.transform(date, "yyyy/MM/dd");
	}
	onSelectFile(row, event) {

		if (event.files !== undefined) {
			this.uploadedFiles = event.files[0];
			row.attachmentData = event.files[0];
			row.attachmentType = event.files[0].type;
			row.fileName = event.files[0].name;
			this.leaveRequest.fileName = event.files[0].name;
		}
	}
	deleteUploadedFile(row) {
		this.uploadedFiles = null;
		row.attachmentData = null;
		row.attachmentType = null;
		row.fileName = "";



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
	saveLeaveRequest(leavepayload) {

		if (this.fileUploader.uploadedLock == false) {


			this.loading = true;
			this.isLoading = true;

			if (leavepayload.fileName == null) {
				leavepayload.fileGuid = '';
				leavepayload.fileName = '';
				leavepayload.attachmentType = '';
			}

			if (!isNullOrUndefined(leavepayload.id) && leavepayload.id !== 0) {
				this._LoaderService.displayLoader(true);
				leavepayload.FileAttachment = leavepayload.attachmentData;

				const form: FormData = this.getFormData(leavepayload);

				this._LeaveRequestService.updateLeaveRequest(form)
					.pipe(
						takeWhile(() => !this.isDestroyed),
						finalize(() => {
							this.loading = false;
							this.isLoading = false;
							this._LoaderService.displayLoader(false);

						}),
						filter(response => response !== null && response !== undefined),
						tap(() => {
							this.selectedId = undefined;
							this.showHideLeaveRequestForm(false);
							this.isLoading = false;
							this._UtilityService.showSuccess();
						},
							error => {
								this._LoaderService.displayLoader(false);

								this.isLoading = false;
								if (isNullOrUndefined(error.error)) {
									this._UtilityService.showErrorMessage(this._UtilityService.translate('GenericErrorMessage'));
								}
								else {
									this._UtilityService.showError(this._UtilityService.translate(error.error));
								}
							}
						)
					).subscribe();
			}
			else {
				leavepayload.id = 0;

				leavepayload.FileAttachment = leavepayload.attachmentData;
				const form: FormData = this.getFormData(leavepayload);

				this._LoaderService.displayLoader(true);


				this._LeaveRequestService.insertLeaveRequest(form)
					.pipe(
						takeWhile(() => !this.isDestroyed),
						finalize(() => {
							this.loading = false;
							this.isLoading = false;
							this._LoaderService.displayLoader(false);
						}),
						filter(response => response !== null && response !== undefined),
						tap(() => {
							this.selectedId = undefined;
							this.isLoading = false;
							this._UtilityService.showSuccess();


							this.showHideLeaveRequestForm(false);
						},
							error => {
								this._LoaderService.displayLoader(false);

								this.isLoading = false;

								// this._UtilityService.showError(this._UtilityService.translate(error.error));

								this._NotificationService.warning(this._UtilityService.translate(error.error));


								// if (isNullOrUndefined(error.error)) {
								// 	this._UtilityService.showErrorMessage(this._UtilityService.translate('error'));
								// }
								// else {
								// 	this._UtilityService.showError(this._UtilityService.translate(error.error));
								// }
							}
						)
					).subscribe();
			}
		}
		else {
			this.isLoading = false;
			this._NotificationService.warning(this._UtilityService.translate("TheFilesHaven'tBeenUploadedYet"));
		}
	}



	// getActiveEmployees() {
	// 	this._EmployeesService
	// 		.getActiveEmployees(this.companyId)
	// 		.pipe(
	// 			filter(response => response !== null && response !== undefined),
	// 			tap(response => {
	// 				this.activeEmployees = response;
	// 				this.activeEmployees.map( e=> {
	// 					e.label = e.firstName + " " + (e.middleName ? e.middleName : "") + " " + e.lastName;
	// 					return e;
	// 				})

	// 			})
	// 		)
	// 		.subscribe();
	// }


	onSelectEmployee(employee) {
		console.log(employee);
		this.employeeId = employee.employeeId;
		this.leaveRequest.employeeId = this.employeeId;
	}





	getPositions() {

	return	this._PositionService.GetPositionsAssignmentsChartByCompanyId(this.companyId)
			.pipe(
				takeWhile(() => !this.isDestroyed),
				finalize(() => {
					this._LoaderService.displayLoader(false);
				}),
				tap(response => {
					this.generatePrimeTree(response);


					const multipleRoots = this.data.filter(d => d.parentId === null || d.parentId === undefined || d.parentId === 0)

					if (multipleRoots.length > 1) {
						for (let i = 0; i < multipleRoots.length; i++) {
							if (multipleRoots[i].children && multipleRoots[i].children.length > this.maxChildrenNum) {
								this.maxChildrenNum = multipleRoots[i].children.length;
								this.mainRootId = multipleRoots[i].id;
								this.mainRoot = multipleRoots[i];
							}
						}
						this.data = this.data.filter(d => d.parentId !== undefined && d.parentId !== 0);
						this.data.unshift(this.mainRoot);
					}

					this.dataLoaded = true;
					this.getAllEmployees();
				})
			)

	}
	generatePrimeTree(flatTree: any[]): any[] {
		let result: any[] = [];

		let roots = flatTree.filter(item => item.reportingTo == null || item.reportingTo == 0);

		roots.forEach(r => {
			result.push(
				{
					id: r.id,
					name: r.fullName,
					positionName: r.title,
					parentId: r.reportingTo,
					username: r.employeeUsername,
					employeeId: r.employeeId
				}
			);
		});

		this.data.push(...result);

		result.forEach(node => {
			this.buildChildren(node, flatTree);
		});

		return result;
	}
	buildChildren(node: any, flatTree: any[]) {

		let children = [];
		let flatChildren = flatTree.filter(item => (item.reportingTo != null && item.reportingTo != 0) && item.reportingTo == node.id);
		flatChildren.forEach(r => {
			children.push(
				{
					id: r.id,
					name: r.fullName,
					positionName: r.title,
					parentId: r.reportingTo,
					username: r.employeeUsername,
					employeeId: r.employeeId
				}
			);
		});

		this.data.push(...children);
		if (children.length != 0) {
			node.children = children;
			node.children.forEach(c => {
				this.buildChildren(c, flatTree);
			});
		}
		else {
			node.leaf = true;
		}
	}

	getAllEmployees() {
		const username = localStorage.getItem('userName');
		let list = this.data;
		let emp = list.find(p => p.username === username);
		this.finalEmpList.push({
			name: emp.name,
			positionName: emp.positionName,
			username: emp.username,
			employeeId: emp.employeeId
		});
		this.getSubEmployees(emp);
		this.finalEmpList = this.finalEmpList.filter(l => l.employeeId !== undefined)

	}


	getSubEmployees(emp){
		if(emp.children){
			emp.children.forEach(c => {
				this.finalEmpList.push({
					name: c.name,
					positionName: c.positionName,
					username: c.username,
					employeeId: c.employeeId
				});
				this.getSubEmployees(c);
			});

		}
	}
}
