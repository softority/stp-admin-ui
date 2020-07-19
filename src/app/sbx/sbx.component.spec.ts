import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbxComponent } from './sbx.component';

describe('SbxComponent', () => {
  let component: SbxComponent;
  let fixture: ComponentFixture<SbxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
