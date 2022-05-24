import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  token: any;

  public tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('Logintoken');
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    //return next.handle(modifiedReq).pipe();

    return next.handle(modifiedReq).pipe(

      catchError(error => {

        if (error instanceof HttpErrorResponse) {

          switch ((<HttpErrorResponse>error).status) {


            case 401:
              let refreshToken = localStorage.getItem('Refreshtoken');
              return this.refreshtoken(refreshToken).pipe(
                switchMap((response: any) => {

                  if (response) {

                    this.token = (<any>response).access_token;
                    localStorage.setItem('Logintoken', this.token);
                    localStorage.setItem('Refreshtoken', (<any>response).refresh_token);

                    let newToken = this.token;
                    this.tokenSubject.next(newToken);
                    return next.handle(this.addToken(req, newToken));

                  }
                }),

              );
            default:

              return observableThrowError(error);

          }

        } else {

          return observableThrowError(error);

        }

      })

    );
  }


  refreshtoken(refreshToken) {
    const payload = new HttpParams()
      .set('refresh_token', refreshToken)
      .set('grant_type', 'refresh_token')
      .set('client_id', 'MagnarClientId')
      .set('client_secret', 'MagnarClientIdKey');
    return this.http
      .post('http://localhost:1478/connect/token', payload)
      .pipe();
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {

    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })

  }
}