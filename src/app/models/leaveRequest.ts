import { SecurableObject } from "./SecurableObject";

export class LeaveRequest extends SecurableObject {
	public id: number;
	public leaveId: number;
	public companyId: number;
	public employeeId: number;
	public fromDate: Date;
	public toDate: Date;
	public daysCount: number;
	public hours: number;
	public status: number;
	public comment: string;
	public leaveName: string;
	public statusName: string;
	public workflowInstanceId: string;
	public leaveTransactionId: number;
	public isPostedToLeaveTransaction: boolean;
	public isEditable: boolean;
	public approvers: any[];
	public workflowTaskId:number;
	public offCycle: boolean;
}
