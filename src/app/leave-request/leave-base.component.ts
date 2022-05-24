import { OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { takeWhile, filter, tap } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { ConfigurationService } from "../service/configuration.service";
import { EmployeeLookupService } from "../service/employee-lookup.service";
import { WorkflowtemplateService } from "../service/workflow-template.service";
import { LeaveRequestService } from "../service/leaveRequest.service";

export class LeaveBaseComponent implements OnDestroy {
	employees: any[];
	companyId: number;
	employeeId: string;
	organizationId: string;
	workflowStatuses: any[];
	calendarDateFormat: string;
	leaves: any;
	protected isDestroyed = false;

	constructor(
		protected datePipe: DatePipe,
		protected _leaveRequestService: LeaveRequestService,
		protected _ConfigurationService: ConfigurationService,
		protected _EmployeeLookupService: EmployeeLookupService,
		protected _WorkflowtemplateService: WorkflowtemplateService) {
	}

	ngOnDestroy(): void {
		this.isDestroyed = true;
	}

	getDateFormat() {
		this.calendarDateFormat = this._ConfigurationService.pCalendarDateFormat;
	}

	transformDate(date) {
		return this.datePipe.transform(date, 'yyyy/MM/dd');
	}

	getEmployees() {
		return this._EmployeeLookupService.getAllEmployeesLookups(this.companyId)
			.pipe(
				takeWhile(() => !this.isDestroyed),
				filter(response => !isNullOrUndefined(response)),
				tap(response => this.employees = response)
			);
	}

	getLeaves() {
		
		return this._leaveRequestService.GetLeaves()
			.pipe(
				takeWhile(() => !this.isDestroyed),
				filter(response => !isNullOrUndefined(response)),
				tap(response => this.leaves = response)
			);
	}

	getWorkflowStatuses() {
		return this._WorkflowtemplateService.getWorkflowStatuses()
			.pipe(
				takeWhile(() => !this.isDestroyed),
				filter(response => !isNullOrUndefined(response)),
				tap(response => this.workflowStatuses = response)
			);
	}
}
