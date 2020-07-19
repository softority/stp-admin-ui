import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelListComponent } from './expansion-panel-list.component';

describe('ExpansionPanelListComponent', () => {
  let component: ExpansionPanelListComponent;
  let fixture: ComponentFixture<ExpansionPanelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansionPanelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
