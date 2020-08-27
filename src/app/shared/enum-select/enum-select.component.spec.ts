import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumSelectComponent } from './enum-select.component';

describe('EnumSelectComponent', () => {
  let component: EnumSelectComponent;
  let fixture: ComponentFixture<EnumSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
