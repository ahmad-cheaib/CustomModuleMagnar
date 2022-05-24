import { AnyMxRecord } from 'dns';
import { SecurableObject } from './SecurableObject';
export class POCO {
	public employee: Employees;

	public employeeCompetencies: any[];

	public employeeObjectives: any[];
}
export class Employees extends SecurableObject {

	public extendedProperties: string="{}";
  

	public id: number;
	public bankCountryId: number;
	public bankId: number;
	public companyID: number;
	public departmentID: number;
	public employeeTypeID: number;
	public branchID: number;
	public directManager: number;
	public costCenterID: number;
	public costCenterID1: number;
	public costCenterID2: number;
	public costCenterID3: number;
	public costCenterID4: number;
	public firstName: string;
	public noExemption: boolean;
	public middleName: string;
	public email: string;
	public lastName: string;
	public religionId: number;
	public startDate: any;
	public contractStartDate: any;
	public contractEndDate: any;
	public visaEndDate: any;
	public visaNumber: any;
	public bloodType: string;
	public nationalityId: number;
	public employeeGroupId: number;
	public status: string;
	public stopDate: any;
	public rejoinDate: any;
	public registerNumber: number;
	public professionId: number;
	public profileId: number;
	public calendarId: number;
	public positionId: number;
	public dailyRateElementId: number;

	public grade: number;
	public rank: number;

	public idNumber: string;
	public passport: string;
	public passport1: string;
	public gender: number;
	public maritalStatus: number;
	public isNSSF: boolean;
	public nssfNum: string;
	public nssfStart: any;
	public isEOS: boolean;
	public isProvision: boolean;
	public provisionDate: any;
	public provisionNum: number;
	public medicalInsurance: boolean;
	public leaveBalance: number;
	public openingBalance: number;
	public dependencies: any;
	public rejoinings: any;
	public dateofBirth: any;
	public passpotExpirationDate: any;
	public idExpirationDate: any;
	public educations: any;
	public addresses: any;
	public assets: any;
	public code: string;
	public bankName: string;
	public bankCountry: string;
	public bankCity: string;
	public bankStreet: string;
	public iban: string;
	public swift: string;

	public username: string;
	public externalId: string;
	public unitID: number;
	public sectionID: number;
	public divisionID: number;
	public levelID: number;
	public attachments: any[];
	public sponsorFileNumber: string;
	public sponsorName: string;
	public sponsorFileExpiry: any;
	public profilePictureBase64: string;
	public profilePictureThumbnail: string;
	public projects: any[];
	public effectiveFrom: any;

}
export class Applicant extends Employees {
	public jobOpennings: any[];
}
