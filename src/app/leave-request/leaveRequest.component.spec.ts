import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestComponent } from './leaveRequest.component';

describe('BookDataComponent', () => {
  let component: LeaveRequestComponent;
  let fixture: ComponentFixture<LeaveRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
