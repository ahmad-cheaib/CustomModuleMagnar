import { HttpClient } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-extended-property-valueSelector',
  templateUrl: './extended-property-valueSelector.component.html',
  styleUrls: ['./extended-property-valueSelector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ExtendedPropertyValueSelectorComponent,
    multi: true
  }]
})
export class ExtendedPropertyValueSelectorComponent implements OnInit, ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: false })
  formControlDirective: FormControlDirective;

  
  /*
  @Input()
  formControl: FormControl;
*/

  @Input()
  formControlName: string;


  @Input()
  valueSelectorType: string;

  @Input()
  configuration: string;

  @Input()
  parentFormGroup:FormGroup;


  private _valueSelectorConfiguration:any;
  get valueSelectorConfiguration():any{
    if(this._valueSelectorConfiguration!=null){
      return this._valueSelectorConfiguration;
    }

    if(this.configuration!=null && this.configuration.length>0){
      this._valueSelectorConfiguration = JSON.parse(this.configuration);
    }

    return this._valueSelectorConfiguration;
  }

  get control() {
    return this.controlContainer.control?.get(this.formControlName);
  }

  constructor(private controlContainer: ControlContainer,private translate: TranslateService, private httpClient:HttpClient) {

     
  }

  ngOnInit(): void {

  }

  writeValue(obj: any): void {
  
    this.formControlDirective?.valueAccessor?.writeValue(obj);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.formControlDirective?.valueAccessor?.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {

   // console.log('registerOnTouched',this.formControlDirective?.valueAccessor);

  //  this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.formControlDirective?.valueAccessor?.setDisabledState) {
      this.formControlDirective?.valueAccessor?.setDisabledState(isDisabled);
    }
  }

  private _configOptions: SelectItem[];
  get configOptions(): SelectItem[] {

    if (this._configOptions != null) {
      return this._configOptions;
    }

    if (this.valueSelectorType.toLowerCase() != "choice") {
      this._configOptions = [];
      return this._configOptions;
    }

    if (!this.valueSelectorConfiguration.options || this.valueSelectorConfiguration.options.length == 0) {
      this._configOptions = [];
      return this._configOptions;   
    }

    this._configOptions= new Array<SelectItem>();

    var optionsValues = (<string>this.valueSelectorConfiguration.options).split(";").map(x => x.trim());

    for (let optionsValue of optionsValues) {
      this._configOptions.push({ label: optionsValue, value: optionsValue });
    }

    return this._configOptions;
  }

  private _choiceOptions: Observable<SelectItem[]>;
  get choiceOptions(): Observable<SelectItem[]>{

    

    if (this._choiceOptions != null) {
      return this._choiceOptions;
    }

    

    if (this.valueSelectorType.toLowerCase() != "choice") {
      this._choiceOptions = of([]);
      return this._choiceOptions;
    }
    

    // check if static options
    if (this.valueSelectorConfiguration.options!=null && this.valueSelectorConfiguration.options!=undefined &&  this.valueSelectorConfiguration.options.length > 0) {
      
      let result  = new Array<SelectItem>();

      var optionsValues = (<string>this.valueSelectorConfiguration.options).split(";").map(x => x.trim());

      for (let optionsValue of optionsValues) {
        result.push({ label: optionsValue, value: optionsValue });
      }

      this._choiceOptions=of(result);
      return this._choiceOptions; 
    }

    //console.log('this.valueSelectorConfiguration.url',this.valueSelectorConfiguration.url);

    // check if dynamic options
    if (this.valueSelectorConfiguration.url!=null && this.valueSelectorConfiguration.url!=undefined &&  this.valueSelectorConfiguration.url.length >= 0) {

      // resolve the url
      var dependencies = this.getDependencies(this.valueSelectorConfiguration?.url);

      this._choiceOptions= this.resolveAndGetChoiceOptions(this.valueSelectorConfiguration.url,dependencies,"",null);


      for(let dependency of dependencies){
        this.parentFormGroup.controls[dependency].valueChanges.subscribe(newValue=>{
          this._choiceOptions=this.resolveAndGetChoiceOptions(this.valueSelectorConfiguration.url,dependencies,dependency,newValue);
        });
      }


      return this._choiceOptions; 
      
    }
    

    this._choiceOptions = of([]);
    return this._choiceOptions;
  }

  getDependencies(inputStr:string):string[]{

    if(inputStr==null || inputStr==undefined || inputStr.length==0){
      return new Array<string>();
    }

    let regex = new RegExp(/@[a-z_1-9]+/gi);

    let matches= inputStr.match(regex);

    var result = Array<string>();

    if(matches!=null && matches.length>0){
      for(let match of matches){
        result.push(match.substr(1));
      }
    }


    return result;
    
  }

  resolveAndGetChoiceOptions(url:string,dependencies:string[], changedDependencyName:string, changedDependencyValue:any):Observable<SelectItem[]>{
    
    let newUrl=url;
    if(changedDependencyName!=null && changedDependencyName.length>0){
      newUrl=newUrl.replace("@"+changedDependencyName,changedDependencyValue);
    }
      
      if(dependencies!=null && dependencies.length>0){
        newUrl=this.resolveDependencies(newUrl,dependencies);

       
      }
      
 
     // console.log('newUrl',newUrl);
      
      
      return this.getChoiceUrlResponse(newUrl).pipe(map(items=>{

        let result  = new Array<SelectItem>();

        if(!!this.valueSelectorConfiguration.valueField && !!this.valueSelectorConfiguration.displayField){
        
          for (let item of items) {
            result.push({ label: item[this.valueSelectorConfiguration.displayField], value: item[this.valueSelectorConfiguration.valueField] });
          }
    
        }
        else{
          for (let item of items) {
            result.push({ label: item, value: item });
          }
        }

        return result;
      }));
  }

  resolveDependencies(inputStr:string, dependencies:string[]):string{

    if(dependencies==null || dependencies.length==0){
      return inputStr;
    }

    let newStr=inputStr;

    for(let dependency of dependencies){
        let dependencyValue = this.parentFormGroup.value[dependency];

        newStr=newStr.replace("@"+dependency,dependencyValue);

    }

    return newStr;
  }

  getChoiceUrlResponse(url:string):Observable<any[]>{

   // console.log('getChoiceUrlResponse',url);

    if(url.toLowerCase().indexOf('testapi')>-1){

      
      if(url.toLowerCase().indexOf('roles')>-1){
        return of(["Admin","Contributor","Reader"]);
      }

      if(url.toLowerCase().indexOf('users')>-1){

        if(url.toLowerCase().indexOf('admin')>-1){
          return of([{
            loginName:"az39",
            displayName:"Ali Zaiter"
          },
          {
            loginName:"hs24",
            displayName:"Housam Saghir"
          }
        ]);
        }
  
        if(url.toLowerCase().indexOf('contributor')>-1){
          return of([
          {
            loginName:"rf09",
            displayName:"Rami Farran"
          }
        ]);
        }
  
        if(url.toLowerCase().indexOf('reader')>-1){
          return of([
          {
            loginName:"mb35",
            displayName:"Mona Boji"
          },
          {
            loginName:"ns76",
            displayName:"Nathalie Sawaya"
          }
        ]);
        }
      }

      return of([]);
    }

    return this.httpClient.get(url).pipe(map(x=><any[]>x));
  }

  private _configEditable: boolean;
  get configEditable(): boolean {

    if (this._configEditable != null) {
      return this._configEditable;
    }

    if(this.valueSelectorConfiguration.editable==null || this.valueSelectorConfiguration.editable==undefined){
      this._configEditable=false;
      return this._configEditable;
    }

    this._configEditable=this.valueSelectorConfiguration.editable;
    return this._configEditable;
  }

  private _configIncludeTime: boolean;
  get configIncludeTime(): boolean {

    if (this._configIncludeTime != null) {
      return this._configIncludeTime;
    }

    if(this.valueSelectorConfiguration.includeTime==null || this.valueSelectorConfiguration.includeTime==undefined){
      this._configIncludeTime=false;
      return this._configIncludeTime;
    }

    this._configIncludeTime= this.valueSelectorConfiguration.includeTime; 
    return this._configIncludeTime;
  }

  private _configDropdownPlaceHolder: string;
  get configDropdownPlaceHolder(): string {
    if (this._configDropdownPlaceHolder != null) {
      return this._configDropdownPlaceHolder;
    }

    if(this.configEditable){
      this._configDropdownPlaceHolder="";
    }
    else{
      this._configDropdownPlaceHolder=this.translate.instant('common.Select');
    }

    return this._configDropdownPlaceHolder;

  }

  
}
