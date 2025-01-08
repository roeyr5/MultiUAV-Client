import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDialogComponent } from './add-new-dialog.component';

describe('AddNewDialogComponent', () => {
  let component: AddNewDialogComponent;
  let fixture: ComponentFixture<AddNewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewDialogComponent]
    });
    fixture = TestBed.createComponent(AddNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
