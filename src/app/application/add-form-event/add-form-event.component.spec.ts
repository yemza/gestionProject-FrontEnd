import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormEventComponent } from './add-form-event.component';

describe('AddFormEventComponent', () => {
  let component: AddFormEventComponent;
  let fixture: ComponentFixture<AddFormEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFormEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
