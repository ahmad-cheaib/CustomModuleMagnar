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


export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LeaveRequestComponent
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild([
      {
        path: '**', component: LeaveRequestComponent
      }
    ])
  ],
  exports: [AppComponent,
    LeaveRequestComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    HttpClient,
    ConfigurationService,
    UtilityService,
    LoaderService,
    ChildrenOutletContexts
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
