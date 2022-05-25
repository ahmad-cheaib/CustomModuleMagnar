import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { UtilityService } from '../../service/utility.service';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit, OnChanges {
	@Input() titleKey: string;
	@Input() messagekey: string;
	@Input() showDelete: boolean = true;
	@Input() confirmKey: string = 'common.Delete';
	@Input() displayConfirmation = false;
	@Output() onConfirm: EventEmitter<void> = new EventEmitter();
	@Output() onAbort: EventEmitter<void> = new EventEmitter();


	@ViewChild('confirmDeleteButton')
	confirmDeleteButton: ElementRef;

	constructor(private utilityService: UtilityService) {
		//empty
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		if(changes.showDelete && this.confirmDeleteButton) {
			this.confirmDeleteButton.nativeElement.click();
		}
	}

	ngOnInit() {
		// empty
	}

	closeModal() {
		this.utilityService.showDeleteModel = false;
	}

}
