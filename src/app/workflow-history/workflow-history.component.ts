import { Component, OnInit, OnDestroy, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { EmployeesService } from '../service/employees.service';
import { WorkflowTaskService } from '../service/workflowTasks.service';

@Component({
	selector: 'app-workflow-history',
	templateUrl: './workflow-history.component.html',
	styleUrls: ['./workflow-history.component.css'],
})
export class WorkflowHistoryComponent implements OnInit, OnDestroy {
	@Input() instanceId: any;
	@Input() companyId: number;

	@Output() activitiesLoaded: EventEmitter<any> =   new EventEmitter();

	@ViewChild('commentsDialog')
	commentsDialog: ElementRef;

	private isDestroyed = false;

	wfInstance: any;
	activities: any[];
	tasks: any[];
	statusList: any;
	cmnt: any;
	text: string;
	uniqueId: any;

	constructor(private _employeeService: EmployeesService, private _workflowTaskService: WorkflowTaskService) {
		this.uniqueId = Math.random().toString(36).slice(-5);
	}

	ngOnInit(): void {
		this.statusList = {
			'4': 'Closed',
			'5': 'common.NotStarted',
			'1': 'common.Inprogress',
			'2': 'common.Approved',
			'3': 'common.Rejected',
			'6': 'common.Inprogress',
			'7': 'common.Inprogress'
		};
		this.text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
	}
	ngOnChanges(changes: SimpleChanges): void {
		//select old values by default usefuil in edit mode
		//get the options

		if (changes != null) {
			let instanceIdValue = changes.instanceId.currentValue;
			if (instanceIdValue) {
				this.GetItemWorkflowInstance(instanceIdValue);
				this.GetWorkflowTasks(instanceIdValue);
			}
		}
	}
	GetWorkflowTasks(id) {
		this._workflowTaskService.getTasksByInstanceId(id).subscribe(res => {
			let UsersBuilder = [];
			let UsersQueryBuilder = '';
			let resTasks = res;
			res.forEach((element, index) => {
				if (!UsersBuilder.includes(element.assignee)) {
					UsersBuilder.push(element.assignee);
					if (index == 0) {
						UsersQueryBuilder += "username eq '" + element.assignee + "'";
					} else {
						UsersQueryBuilder += "or username eq '" + element.assignee + "'";
					}
				}
			});
			if (UsersQueryBuilder != '') {
				UsersQueryBuilder = `(${UsersQueryBuilder}) and companyId eq ${this.companyId}`;
				this._employeeService.getOdata(UsersQueryBuilder).subscribe(res => {
					resTasks.forEach(element => {
						let find = res.find(r => r.username == element.assignee);

						if (!isNullOrUndefined(find) && find != '') {
							element.approverName = `${find.firstName} ${
								isNullOrUndefined(find.middleName) ? '' : find.middleName
							} ${find.lastName}`;
						}
					});

					this.tasks = resTasks;
				});
			} else {
				this.tasks = resTasks;
			}
		});
	}
	GetItemWorkflowInstance(id) {
		this._workflowTaskService.getWorkflowInstanceData(id).subscribe(res => {
			this.wfInstance = JSON.parse(res);

			let UsersBuilder = [];
			let UsersQueryBuilder = '';
			this.wfInstance.Activities = this.wfInstance.Activities.filter(a => a.Assignee);
			this.wfInstance.Activities.forEach((element, index) => {
				if (!UsersBuilder.includes(element.Assignee)) {
					UsersBuilder.push(element.Assignee);
					if (index == 0) {
						UsersQueryBuilder += "username eq '" + element.Assignee + "'";
					} else {
						UsersQueryBuilder += "or username eq '" + element.Assignee + "'";
					}
				}
			});
			if (UsersQueryBuilder != '') {
				UsersQueryBuilder = `(${UsersQueryBuilder}) and companyId eq ${this.companyId}`;
			}

			this._employeeService.getOdata(UsersQueryBuilder).subscribe(res => {
				this.wfInstance.Activities.forEach(element => {
					let find = res.find(r => r.username == element.Assignee);

					if (!isNullOrUndefined(find) && find != '') {
						element.fullName = `${find.firstName} ${
							isNullOrUndefined(find.middleName) ? '' : find.middleName
						} ${find.lastName}`;
						element.positionName = find.positionName;
					}
				});

				this.activities = this.wfInstance.Activities;
				if(this.activities !== null && this.activities !== undefined){
					this.activitiesLoaded.emit(this.activities);
				}
			});
		});
	}
	ngOnDestroy() {
		this.isDestroyed = true;
	}

	showBasicDialog1(rowData) {
		this.cmnt = rowData;
		this.commentsDialog.nativeElement.click();
	}
	
}
