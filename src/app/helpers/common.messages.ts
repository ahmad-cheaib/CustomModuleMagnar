export class CommonMessages {
	// common
	public static Success = 'Success';
	public static Submit = 'submit';
	public static Error = 'Error';
	public static RecordAddSucess = 'Record inserted successfully';
	public static RecordUpdateSucess = 'Record updated successfully';
	public static RecordDeleteSucess = 'Record deleted successfully';
	public static ProfileUpdateSucess = 'Profile updated successfully';
	public static PasswordUpdateSucess = 'Password updated successfully';
	public static PasswordIncorrect = 'Incorrect password';
	public static RecordExists = 'Record already exists';
	public static DeleteConfim = 'Are you sure to delete this record?';
	public static CommonErrorMessage = 'Something went wrong. Please try again later!!';
	public static CommonSaveErrorMessage = 'Please check your inputs then retry saving.';

	// periodic movment
	public static periodicMovmentInputError = 'Please insert Numeric Value!!';
	public static periodicMovmentExchangeRateError =
		'Ammount was not saved.\n Please check your exchange rate data on Period From date and try again!!';
	public static ElementExistMessage = 'Element ALready exist. Please insert different element!!';
	public static CurrencyExistMessage =
		'Some of your data you insert is aLready exist. Please check your currency names:';
	public static CostCenterCode = '\nCost Center Code:';
	public static Description = '\nDescription: ';
	public static Description1 = '\nDescription1: ';
	public static ISO = '\nISO: ';
	public static ISO1 = '\nISO1: ';
	public static SelectEmployeeType = 'Please Select Employee Type';
	public static SelectMonth = 'Please Select Month';
	public static SelectYear = 'Please Select Year';
	public static ExecutionError = 'Error exist in execute';
	public static ExecuteSuccess = 'Record execute successfully';
	public static ProcessedPeriodicMovmentError = 'Unable to modify processed element!!';
	public static ProcessedPeriodError = 'Unable to modify element of processed period!!';
	public static OrganizationLocalCurrencyError = 'Unable to modify element with no organization currency!!';
	public static ElementOrderingError = 'Please check your profile.\nElement Ordering is not Valid at:\n';

	// Generate Worksheet
	public static RevertSuccess = 'Record revert successfully';
	public static RevertError = 'Record Procees Failed';
	public static RevertPostedPeriodError = 'Unable to revert. The period is posted';
	public static RevertProcessedPeriodError = 'Unable to revert. The period is Processed';
	public static ExecutionExchangeRateError =
		'Execution Failed.\n Please add exchange rate data for your current period and try again!!';
	public static ExecutionOrganizationLocalCurrencyError =
		'Execution Failed.\nUnable to execute with organization have no currencies!!';

	// Login
	public static WrongUser = 'You have entered an invalid username or password';

	// periodic page
	public static missingdata = 'insert data to periodic page name and description.';

	// period Page
	public static ErrorCurrentSelected =
		'Already there is a current period selected. Please deselect it and try again.';
	public static SaveDonesuccess = 'Save done successfully';
	public static PeriodNumberExists = 'Period Number already exists. \n';
	public static PeriodNumberError = 'Please check your period number. \n';
	public static MonthDaysError = 'Please check your month days. \n';
	public static CurrentPeriodNotExist = 'Please Select Current Period and try again.';
	public static DefaultProfileNotExist = 'Please Select default Profile and try again.';
	public static FromToDateDifference = 'From date selected at year different than to date selected year.';
	public static FromToDateDifferentFromSelectedYear =
		'From date or to date selected year is different from selected year.';

	// periodic profile
	public static NewRowExistMessage = 'New row aLready exist!!';
	public static OrderErrorMessage = 'Please check your order inputs then retry saving.';
	public static OrderExistErrorMessage = 'Please check your inputs. Order already exists.';
	public static NoNewRowExistMessage = 'Please check your inputs. Selected element already exist.';

	// elements
	public static customcalculationsetupErrorMessage =
		'Please check your custom calculation setup formula then retry saving.';
	public static selectedProvisionElement = 'Selected provision element is mapped to another element.';

	// periodical History
	public static EmployeeProcessesErrorMessage = 'Execute not completed. Not all employees are processed.';

	// calendar
	public static NameErrorMessage = 'Please check your input name. Name already exist.';
	public static EmptyNameErrorMessage = 'Please check your input name. Name is empty.';
	public static FromToDateErrorMessage =
		'Please check your input name. At calendar holiday, From date must be greater than to date.';

	// employee
	public static PassportExpDateofBirthErrorMessage =
		'Please check your input. Passport expiry must be greater than date of birth.';
	public static AllowanceDateDateofBirthErrorMessage =
		'Please check your input. Allowance date must be greater than date of birth.';
	public static DeletionDateDateofBirthErrorMessage =
		'Please check your input. Deletion date must be greater than date of birth.';
	public static DeletionDateAllowanceDateErrorMessage =
		'Please check your input. Deletion date must be greater than allowance date.';
		public static DeletionDatejoiningDateErrorMessage =
		'Please check your input. joining Date required.';

	//#region Leaves
	public static ErrorAnotherAnnualLeaveExist =
		'Another Annual record exists. Remove it and save before creating another Annual Leave';
	public static EmptyCodeErrorMessage = 'Please check your input code. Code is empty.';
	public static ElementErrorMessage = 'Please check your input. Element is not selected.';
	public static CategoryErrorMessage = 'Please check your input. Category is not selected.';
	public static TypeErrorMessage = 'Please check your input. Type is not selected.';
	//#endregion

	// leave Transactions
	public static EmployeeErrorMessage = 'Please check your input. Employee is not selected.';
	public static FromDateErrorMessage = 'Please check your input. From date is not selected. \n';
	public static FromDateToDateErrorMessage = 'Please check your input. From date is greater than to date. \n';
	public static ToDateErrorMessage = 'Please check your input. To date is not selected. \n';
	public static DaysNumberErrorMessage = 'Please check your input. Days number must be greater than zero.';
	public static HoursErrorMessage = 'Please check your input. Hours must be greater than zero.';
	public static Hours24ErrorMessage = 'Please check your input. Hours must be less than 24.';
	public static CompareHoursErrorMessage =
		'Please check your input. User can not enter number of hours that is greater than his daily working hours.';
	public static EmployeeCalendarErrorMessage =
		'Save is not Completed. \nPlease select calendar for employee and try again.';
	public static LeaveErrorMessage = 'Please check your input. Leave is not selected.';
	public static LeaveNotExistErrorMessage = 'Please check your Leaves.';
	public static DateConflictsErrorMessage = 'Please check your input. Leave transactions dates conflict exist.';
	public static EmployeeGradeErrorMessage =
		'Leave type is applied according to' + ' the grade of the employee.\nyour leave days number is overflowed';
	public static EmployeeGradeYearErrorMessage =
		'Leave type is not applied to' +
		'\ngrade base leave or yearly based leave.\n Please add your base leave and try again.';
	public static LeaveDaysCountErrorMessage = 'Your leave days number is overflowed';

	// Based leaves
	public static YearlyBasedLeaveErrorMessage =
		'You are in yearly based leave.' +
		'\n Yearly based leave data must be deleted if you to switch to grade based leave.';
	public static GradeBasedLeaveErrorMessage =
		'You are in grade based leave.' +
		'\n grade based leave data must be deleted if you to switch to yearly based leave.';

	// Employee Loans
	public static CheckInputs = 'Please check your input.';
	public static EmployeeLoanErrorMessage = 'Employee loan type already exist.\n';
	public static LoanErrorMessage = 'Loan not selected.\n';
	public static EmployeeNotSelected = 'Employee is not selected.\n';
	public static EmptyAmount = 'Amount is Empty.\n';
	public static EmptyYear = 'Year is Empty.\n';
	public static LoanInstallmentError = 'Loan Installment inputs not all specified.\n';
	public static LoanInstallmentMonthYearError = 'Loan Installment of same month and year already selected.\n';
	public static LoanInstallmentMonthError = 'Loan Installment month is not selected.\n';
	public static LoanInstallmentYearError = 'Loan Installment year is not selected.\n';
	public static LoanInstallmentAmountError = 'Loan Installment amount is not selected.\n';
	public static NewLoanInstallmentError = 'New Loan Installment already exist.\n';
	public static NotEqualAmount = 'Amount is not equal to loan installments amounts. The different value is:\n';
	public static ValidFormula = 'The formula is valid.';
	public static NotValidFormula = 'The formula is not valid.';
	public static LoanInstallmentDateError = 'Loan Installment year and month must be greater than current date.\n';
	public static ScheduleYearMonthError = 'Year and month for schedule is not selected.\n'
	public static ElementUsedError = 'Element already used:';
	public static LoanAmountException = 'Employee loan amount isn\'t valid.\n';
	public static CodeErrorMessage = 'Please check your input code. Code Already exist.';

	// Expense Requests
	public static ExpenseDateErrorMessage = 'Please check your input. Expense date is not selected. \n';
	public static ExpenseTypeErrorMessage = 'Please check your input. Expense type is not selected. \n';
	public static ExpenseAmountErrorMessage = 'Please check your input. Expense amount is not valid. \n';
	public static ExpenseCurrencyErrorMessage = 'Please check your input. Expense currency is not selected. \n';
	public static ExpenseDateTodayErrorMessage = 'Please check your input. Expense date is greater than current date. \n';

	// Course Category
	public static EmptyDescriptionErrorMessage = 'Please check your input description. Description is empty.';

	// Trainer
	public static EmptyTrainerType = 'Please check your input trainer type. Trainer Type is empty.';
	public static EmptyFirstNameErrorMessage = 'Please check your input first name. First Name is empty.';
	public static EmptyFamilyNameErrorMessage = 'Please check your input family name. Fmaily Name is empty.';

	// Training Agenda
	public static IssueDateDueDateErrorMessage = 'Please check your input. Issue date is greater than Due date.';
	public static StartDateEndDateErrorMessage = 'Please check your input. Start date is greater than End date.';
	public static EmptyMaxAttendees = 'Please check your input Max Attendees. MaxAttendees is empty or less than or equal to zero.';
	public static EmptyMinAttendees = 'Please check your input Min Attendees. MinAttendees is empty or less than or equal to zero.';
	public static DueDateStartDateEndDateErrorMessage = 'Please check your input. Due date is greater than Start date or End date';
	public static IssueDateStartDateEndDateErrorMessage = 'Please check your input. Issue date is greater than Start date or End date';

	// Training Evaluation
	public static EmptyRating = 'Please check your input. Rating input not valid';
	public static EmptyComment = 'Please check your input. Comment input not valid';
	public static EmptyFeedbackItem = 'Please check your input. Feedback Item input not valid';
	public static EmptyFeedbackCategory = 'Please check your input. Feedback Category input not valid';

	// External Training
	public static TravelDateReturnDateErrorMessage = 'Please check your input. Travel date is greater than Return date.';
	public static LeaveFromLeaveToErrorMessage = 'Please check your input. Leave From date is greater than Leave To date.';
	public static TravelDateErrorMessage = 'Please check your input. Travel date is not within range of Leave From and Leave To.';
	public static ReturnDateErrorMessage = 'Please check your input. Return date is not within range of Leave From and Leave To.';

	// Leave Encaashment
	public static InvalidAmountErrorMessage = 'Please check your input amount. Amount must be greater than zero.';
	public static InvalidPaymentDateErrorMessage = 'Please check your input payment date. Payment Date input is not valid.';


	// Pdf Forms
	public static FillRequiredFields = 'Please fill required fields.';
}
