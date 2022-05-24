import { SecurableObject } from "./SecurableObject";

export class Department  extends  SecurableObject {
	public id: number;
	public description: string;
	public code: string;
	public shortDesc: string;
	public parentDepartmentId: number;
	public parentDescription: string;
	public companyId: number;
	public manager: number;
	public branchId:number;
}
