import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageSessionService } from 'src/app/service/storageSession.service';
import { UtilityService } from '../../service/utility.service';

@Component({
  selector: 'app-file-uploader-button',
  templateUrl: './file-uploader-button.component.html',
  styleUrls: ['./file-uploader-button.component.css']
})
export class FileUploaderButtonComponent implements OnInit {
 
  public fileName: string;
  public fileType: string;
  public fileGuid: string;
  public uploadedLock : boolean = false;
  @Output() downloadFile = new EventEmitter()
  @Input() acceptFileTypes = '.*'

  fileData: any;
  private isUploadDisabled = true;
  private loadingObservable: Subscription;
  public isUploading = false;
  @ViewChild("file") fileInputElement: any;
  
  constructor(
    private storageSessionService: StorageSessionService,
    private utilityService : UtilityService
  ) { }

  ngOnInit(): void {
  }

  fileClick(){
    if(!this.fileData){
      this.downloadFile.emit('');
    }
  }


  onSelectFile(event) {
    if (event.files !== undefined) {
      this.fileData = event.files[0];
      this.fileType = event.files[0].type;
      this.fileName = event.files[0].name;
      this.fileInputElement.files = [];
      this.uploadedLock = true;
      this.isUploadDisabled  = false;
    }
  }

  onCancelUpload() {
    this.fileInputElement.files = [];
    this.fileData = null;
    this.fileType = null;
    this.fileName = null;
    this.loadingObservable.unsubscribe();
    this.uploadedLock = false;
    this.isUploading = false;

  }

  deleteUploadedFile(){
    this.fileInputElement.files = [];
    this.fileData = null;
    this.fileType = null;
    this.fileName = null;
    this.uploadedLock = false;
    this.isUploadDisabled = true;

  }

  upload(){
    this.fileGuid = undefined;
    const formData = new FormData();
    this.isUploading = true;
    this.isUploadDisabled = true;


    formData.append('data', this.fileData);
    this.loadingObservable = this.storageSessionService.addsessionData(formData).subscribe(res => {
      this.uploadedLock = false;
      this.isUploading = false;

      this.isUploadDisabled = true;

      if(!this.fileGuid){
        this.fileGuid = res
        this.utilityService.showSuccess();
      }
    },error => {
      this.uploadedLock = true;
      this.isUploading = false;
      this.isUploadDisabled = false;
      //this.utilityService.showErrorMessage("Can't upload file");
    })
  }

  reset(){
    this.fileName = undefined;
    this.fileType = undefined;
    this.fileGuid = undefined;

    this.uploadedLock = false;
    this.isUploading = false;
    this.isUploadDisabled = true;
  }

  resetFileData(){
    this.fileData = undefined;
  }
}
