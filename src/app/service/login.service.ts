import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { catchError, filter, finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';





@Injectable()
export class LoginService {

	private jwtHelper = new JwtHelperService();
	public isRefreshingToken = false;
	public tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	compId: string;
	orgId: string;
	interval: any;

	constructor(private http: HttpClient,
		private utilityService: UtilityService,
		private configurationService: ConfigurationService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private injector: Injector
	) {
		// empty
	}

	getAccountToken(email, password): Observable<any> {
		const data = {
			"payload": {
				"username": email,
				"password": password
			}
		};
		return this.http
			.post(this.configurationService.baseUrl + '/api/Accounts/account', data);
	}

	getAccountTokenByAuthority(code, verifyToken, authority): Observable<any> {
		const data = {
			"AuthorityType": authority,
			"payload": {
				"code": code
			},
			"token": verifyToken
		};
		return this.http
			.post(this.configurationService.baseUrl + `/api/Accounts/account`, data);
	}

	getlogintoken(auth_token) {
		const payload = new HttpParams()
			.set('auth_token', auth_token)
			.set('grant_type', 'authentication')
			.set('client_id', 'MagnarClientId')
			.set('client_secret', 'MagnarClientIdKey')
			.set('scope', 'offline_access');
		return this.http
			.post(this.configurationService.authorityUrl + '/connect/token', payload);
	}



	refreshtoken(refreshToken) {
		const payload = new HttpParams()
			.set('refresh_token', refreshToken)
			.set('grant_type', 'refresh_token')
			.set('client_id', 'MagnarClientId')
			.set('client_secret','MagnarClientIdKey');
		return this.http
			.post(this.configurationService.authorityUrl + '/connect/token', payload)
			.pipe(catchError(e => {
				
				return of(false);
			}));
	}


	isTokenExpired(token: string) {
		if (!token || token == 'null') return true;
		try {
			return this.jwtHelper.isTokenExpired(token);
		} catch (error) {
			return true;
		}
	}

	fillLoginInfo(response) {
		localStorage.setItem('Logintoken', (<any>response).access_token);
		localStorage.setItem('Refreshtoken', (<any>response).refresh_token);

		this.tokenSubject.next((<any>response).access_token);
	}






	public tokenCheck(): Observable<any> {

		const localtoken = localStorage.getItem('Logintoken');
		const refreshToken = localStorage.getItem('Refreshtoken');

		if (!this.isTokenExpired(localtoken)) {
			return of(localtoken);
		} else if (this.isTokenExpired(localtoken) && this.isRefreshingToken) {
			return this.tokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap(token => {
					return of(token);
				}));

		} else if (this.isTokenExpired(localtoken) && !this.isRefreshingToken) {
			this.isRefreshingToken = true;
			this.tokenSubject.next(null);

			return this.refreshtoken(refreshToken).pipe(
				switchMap((response: any) => {
					if (response) {
						const token = (<any>response).access_token;
						this.fillLoginInfo(response);
						return of(token);
					}
				}),

				finalize(() => {
					this.isRefreshingToken = false;
				}));
		}
	}

	public refreshTokenForce(): Observable<any> {
		const refreshToken = localStorage.getItem('Refreshtoken');

		if (this.isRefreshingToken) {
			return this.tokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap(token => {
					return of(token);
				}));

		} else if (!this.isRefreshingToken) {
			this.isRefreshingToken = true;
			this.tokenSubject.next(null);

			return this.refreshtoken(refreshToken).pipe(
				switchMap((response: any) => {
					if (response) {
						const token = (<any>response).access_token;
						this.fillLoginInfo(response);
						return of(token);
					}
				}),

				finalize(() => {
					this.isRefreshingToken = false;
				}));
		}
	}

	refreshTokenAutomatically(active: boolean) {
		
		if (active) {
			this.interval = setInterval(() => {
				const localtoken = localStorage.getItem('Logintoken');
				if (this.jwtHelper.isTokenExpired(localtoken, 10)) {
					this.refreshTokenForce().subscribe();
				}
			}, 5000)
		}
		else{
			clearInterval(this.interval)
		}
	}
}
