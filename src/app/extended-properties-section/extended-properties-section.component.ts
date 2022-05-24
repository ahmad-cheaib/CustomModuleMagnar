import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtendedPropertiesService } from '../service/extendedProperties.service';
import { UtilityService } from '../service/utility.service';

@Component({
  selector: 'app-extended-properties-section',
  templateUrl: './extended-properties-section.component.html',
  styleUrls: ['./extended-properties-section.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ExtendedPropertiesSectionComponent),
    multi: true
  }]
})
export class ExtendedPropertiesSectionComponent implements OnInit, ControlValueAccessor {
  @Input()
  entityName: string;

  @Input()
  sectionName: string;

  extendedProperties: any[];
  _formGroup: FormGroup;

  rows: number[];
  state: string;
  companyId: number;
  organizationId: number;

  get containerId(): number {
    this.state = this.router.routerState.snapshot.url.split("/")[2];

    console.log(this.router.routerState.snapshot.url);
    if (parseInt(this.state)){
      return this.companyId;
    }else{
      return this.organizationId;
    }
    
    
  }

  get containerType(): string {
    this.state = this.router.routerState.snapshot.url.split("/")[2];

    if (parseInt(this.state)){
      return "Company";
    }else{
      return "Organization";
    }

  
  }

  pendingOnChangeEvents: ((value: any) => void)[] = new Array<(value: any) => void>();
  pendingDisabledValue: boolean;
  pendingValue: any;
  pendingHandled = false;

  constructor(private router: Router,private utilityService:UtilityService,private service: ExtendedPropertiesService, private activatedRoute: ActivatedRoute) {
      console.log('ExtendedPropertiesSectionComponent constructor');
  }


  ngOnInit(): void {

    
    this.companyId = 1;
    this.organizationId = 1;	

    console.log('ExtendedPropertiesSectionComponent OnInit');

    this.service.getBySection(this.containerId,this.containerType, this.entityName, this.sectionName).subscribe(data => {

      this.extendedProperties = data.sort((a, b) => {
        if (a.itemOrder > b.itemOrder) {
          return +1;
        }

        if (a.itemOrder < b.itemOrder) {
          return -1;
        }

        return 0;
      });

      this.rows = this.getRows();

      let group: any = {};

      for (let extendedProperty of this.extendedProperties) {

        group[extendedProperty.name] = new FormControl('');

      }

      this._formGroup = new FormGroup(group);

      if (this.pendingHandled == false) {

        if (this.pendingValue != null) {
          this.setFormValue(this.pendingValue);
        }

        for (let pendingEvent of this.pendingOnChangeEvents) {
          this._formGroup.valueChanges.subscribe(data => {
            pendingEvent(data);
          });
        }

        if (this.pendingDisabledValue != null) {
          if (this.pendingDisabledValue == true) {
            this._formGroup.disable();
          }
          else {
            this._formGroup.enable();
          }
        }

        this.pendingHandled = true;
      }
    });


  }

  writeValue(value: any): void {




    if (this._formGroup) {
      this.setFormValue(value);
    } else {
      this.pendingValue = value;
    }

  }

  registerOnChange(fn: (value: any) => void): void {
    if (this._formGroup) {
      this._formGroup.valueChanges.subscribe(data => {
        fn(data);
      });
    }
    else {
      this.pendingOnChangeEvents.push(fn);
    }
  }

  registerOnTouched(fn: () => void): void {

  }

  setDisabledState(isDisabled: boolean): void {
    if (this._formGroup) {
      if (isDisabled) {
        this._formGroup.disable();
      }
      else {
        this._formGroup.enable();
      }
    }
    else {
      this.pendingDisabledValue = isDisabled;
    }
  }

  getRows(): number[] {
    const values = this.extendedProperties.map(x => x.rowOrder);
    const distinct = [...new Set(values)];
    return distinct.sort();
  }

  getRowExtendedProperties(rowOrder: Number): any[] {
    return this.extendedProperties.filter(x => x.rowOrder == rowOrder);
  }

  setFormValue(value: any) {

    //let formKeys = Object.keys(this.formGroup.value);
    let valueKeys = Object.keys(value);

    for (let extendedProperty of this.extendedProperties) {
      let propertyValue = null;

      if (valueKeys.indexOf(extendedProperty.name) > -1) {
        propertyValue = value[extendedProperty.name];

        
        if(extendedProperty.valueSelectorType=='DateTime'){
          propertyValue=new Date(propertyValue);
        }
        
      }

      this._formGroup.controls[extendedProperty.name].setValue(propertyValue);
    }

  }

}
