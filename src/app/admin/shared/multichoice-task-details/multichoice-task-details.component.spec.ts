import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultichoiceTaskDetailsComponent } from './multichoice-task-details.component';

describe('MultichoiceTaskDetailsComponent', () => {
  let component: MultichoiceTaskDetailsComponent;
  let fixture: ComponentFixture<MultichoiceTaskDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultichoiceTaskDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultichoiceTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
