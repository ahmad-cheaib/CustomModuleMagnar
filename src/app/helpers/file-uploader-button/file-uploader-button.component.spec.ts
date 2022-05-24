import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderButtonComponent } from './file-uploader-button.component';

describe('FileUploaderButtonComponent', () => {
  let component: FileUploaderButtonComponent;
  let fixture: ComponentFixture<FileUploaderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploaderButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
