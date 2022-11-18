import { Injectable, Injector } from "@angular/core";

import { throwError as observableThrowError, Observable, BehaviorSubject, of } from 'rxjs';

import { take, filter, catchError, switchMap, finalize } from 'rxjs/operators';

import { HttpRequest, HttpEvent, HttpHandler, HttpErrorResponse } from "@angular/common/http";

import { Router } from '@angular/router';

import { LoginService } from '../service/login.service';

import { NotificationService } from '../service/notification.service';

import { Login } from '../models/login';

@Injectable()
export class TokenInterceptorService  {

	login = new Login();

	constructor(private _notificationService: NotificationService,
		private injector: Injector,
		private router: Router,
		private _loginService: LoginService) { }

	addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
		let organizationId = 1;
		return  req.clone({ 
			setHeaders: 
			{ 
				Authorization: 'Bearer ' + token ,
				OrganizationId: (organizationId).toString()
			} 
		})

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = localStorage.getItem('Logintoken');
		let lang = localStorage.getItem('currentLanguage') ? localStorage.getItem('currentLanguage') : 'en';

		req = req.clone({
			setHeaders: {
				'Accept-Language': lang
			}
		});
		if(
			req.url.endsWith('/connect/token') ||
			req.url.includes('/assets')
		){
				return next.handle(req);
			}

		if (
			!req.url.endsWith('/LeaveRequest/PutLeaveRequest') &&
			!req.url.endsWith('/LeaveRequest/PostLeaveRequest') &&
      !req.url.endsWith('AddSessionData') &&
			!req.url.endsWith('/connect/token')
		) {
			req = req.clone({
				setHeaders: {
					'Content-Type': 'application/json'
				}
			});
		}
		const refreshToken = localStorage.getItem('Refreshtoken');
		// if(!refreshToken || refreshToken== 'null') {
		// 	if(!this.previousRouteService.getPreviousUrl().includes('login')) {
		// 		this.router.navigate(['/login'], { queryParams: { returnUrl: this.previousRouteService.getPreviousUrl() }});
		// 	}
		// }
		if(this._loginService.isTokenExpired(token) && !this._loginService.isRefreshingToken){
			
			this._loginService.isRefreshingToken = true;
			this._loginService.tokenSubject.next(null);

			return this._loginService.refreshtoken(refreshToken).pipe(
				switchMap((response: any) => {

					if (response) {

						this.login.token = (<any>response).access_token;
						this._loginService.fillLoginInfo(response);
						return next.handle(this.addToken(req, this.login.token));

					}
				}),

				finalize(() => {

					this._loginService.isRefreshingToken = false;

				}));

		}else if (this._loginService.isTokenExpired(token) && this._loginService.isRefreshingToken) {
			return this._loginService.tokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap(token => {
					return next.handle(this.addToken(req, token));
				}));
		} else {
			return next.handle(this.addToken(req, token)).pipe(
	
	
				catchError(error => {
					// if(error.url && error.url.endsWith('/connect/token') && this._loginService.isRefreshingToken){
					// 	if(!this.previousRouteService.getPreviousUrl().includes('login')) {
					// 		this.router.navigate(['/login'], { queryParams: { returnUrl: this.previousRouteService.getPreviousUrl() }});
					// 	}
					// }
					if (error instanceof HttpErrorResponse) {
	
						switch ((<HttpErrorResponse>error).status) {
	
							case 400:
	
								return this.handle400Error(error);
	
							case 401:
								return this.handle401Error(req, next);
	
							default:
	
								return observableThrowError(error);
	
						}
	
					} else {
	
						return observableThrowError(error);
	
					}
	
				}));
		}


		//return next.handle(req);
	}


	handle400Error(error) {

		if (error && error.status === 400 && error.error && error.error === 'Invalid Token.') {

			// If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
			this.router.navigate(['login']);

		}



		return observableThrowError(error);

	}



	handle401Error(req: HttpRequest<any>, next: HttpHandler) {


		if (!this._loginService.isRefreshingToken) {

			this._loginService.isRefreshingToken = true;



			// Reset here so that the following requests wait until the token

			// comes back from the refreshToken call.

			this._loginService.tokenSubject.next(null);



			const loginService = this.injector.get(LoginService);

			let refreshToken = localStorage.getItem('Refreshtoken');
			return loginService.refreshtoken(refreshToken).pipe(
				switchMap((response: any) => {

					if (response) {

						this.login.token = (<any>response).access_token;
						localStorage.setItem('Logintoken', this.login.token);
						localStorage.setItem('Refreshtoken', (<any>response).refresh_token);

						let newToken = this.login.token;
						this._loginService.tokenSubject.next(newToken);
						return next.handle(this.addToken(req, newToken));

					}
				}),

				finalize(() => {

					this._loginService.isRefreshingToken = false;

				}));

		} else {

			return this._loginService.tokenSubject.pipe(

				filter(token => token != null),

				take(1),

				switchMap(token => {

					return next.handle(this.addToken(req, token));

				}));

		}

	}

}
