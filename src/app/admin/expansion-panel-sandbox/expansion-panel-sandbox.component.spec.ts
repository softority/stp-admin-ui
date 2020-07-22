import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelSandboxComponent } from './expansion-panel-sandbox.component';

describe('ExpansionPanelSandboxComponent', () => {
  let component: ExpansionPanelSandboxComponent;
  let fixture: ComponentFixture<ExpansionPanelSandboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansionPanelSandboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelSandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
