import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpwComponent } from './editpw.component';

describe('EditpwComponent', () => {
  let component: EditpwComponent;
  let fixture: ComponentFixture<EditpwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
