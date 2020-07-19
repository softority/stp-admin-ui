import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskNameComponent } from './task-name.component';

describe('TaskNameComponent', () => {
  let component: TaskNameComponent;
  let fixture: ComponentFixture<TaskNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
