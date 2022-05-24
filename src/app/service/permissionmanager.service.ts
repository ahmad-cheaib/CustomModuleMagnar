import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';


@Injectable()
export class PermissionManagerService {

    public permissionManager$: Subject<boolean> = new Subject<boolean>();
   
    
   
    public getPermissionUrl() {
  
        this.permissionManager$.next();
    }

	
}
