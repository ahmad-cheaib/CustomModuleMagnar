import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgProgress } from '@ngx-progressbar/core';

@Injectable()
export class LoaderService {
	public loaderStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	constructor(public ngProgress: NgProgress) {}
	public displayLoader(value: boolean) {
		this.loaderStatus$.next(value);
	}
}
