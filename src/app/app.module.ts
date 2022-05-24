import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeaveRequestComponent } from './leave-request/leaveRequest.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChildrenOutletContexts, RouterModule } from '@angular/router';
import { TokenInterceptorService } from './service/Token-interceptor';
import { ConfigurationService } from './service/configuration.service';
import { LoaderService } from './service/loader.service';
import { UtilityService } from './service/utility.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common'; 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationService } from './service/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { LoginService } from './service/login.service';
import { FileUploaderButtonComponent } from './helpers/file-uploader-button/file-uploader-button.component';
import { StorageSessionService } from './service/storageSession.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ExtendedPropertyValueSelectorComponent } from './extended-property-valueSelector/extended-property-valueSelector.component';
import { ExtendedPropertiesService } from './service/extendedProperties.service';
import { ExtendedPropertiesSectionComponent } from './extended-properties-section/extended-properties-section.component';
import {PanelModule} from 'primeng/panel';
import { DepartmentService } from './service/department.service';
import { EmployeeLookupService } from './service/employee-lookup.service';
import { EmployeesService } from './service/employees.service';
import { WorkflowtemplateService } from './service/workflow-template.service';
import { WorkflowTaskService } from './service/workflowTasks.service';
import { WorkflowHistoryComponent } from './workflow-history/workflow-history.component';
import { HrLeaveRequestComponent } from './hr-leave-request/hr-leave-request.component';
import { LeaveService } from './service/leave.service';
import { LeaveRequestService } from './service/leaveRequest.service';
import { PermissionManagerService } from './service/permissionmanager.service';
import { LeaveTransactionsService } from './service/leaveTransactions.service';


export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LeaveRequestComponent,
    FileUploaderButtonComponent,
    ExtendedPropertiesSectionComponent,
    ExtendedPropertyValueSelectorComponent,
    WorkflowHistoryComponent,
    HrLeaveRequestComponent
  ],
  imports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    CommonModule,
    TableModule,
    DropdownModule,
    SelectButtonModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule ,
    HttpClientModule,
    CheckboxModule,
    EditorModule,
    ButtonModule,
    FileUploadModule,
    PanelModule,
    ToastrModule.forRoot({ enableHtml: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild([
      {
        path: '**', component: HrLeaveRequestComponent,
        data: { breadcrumb: 'Leave Requests' },
      }
    ])
  ],
  exports: [AppComponent,
    HrLeaveRequestComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    HttpClient,
    ConfigurationService,
    UtilityService,
    LoaderService,
    NotificationService,
    LoginService,
    StorageSessionService,
    ExtendedPropertiesService,
    WorkflowTaskService,
    WorkflowtemplateService,
    EmployeesService,
    EmployeeLookupService,
    DepartmentService,
    LeaveService,
    LeaveRequestService,
    PermissionManagerService,
    LeaveTransactionsService,
    ChildrenOutletContexts
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
