import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsLayoutComponent } from './tests-layout.component';

describe('TestsLayoutComponent', () => {
  let component: TestsLayoutComponent;
  let fixture: ComponentFixture<TestsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
