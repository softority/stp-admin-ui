import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCategoryTreeComponent } from './task-category-tree.component';

describe('TestCategoryTreeComponent', () => {
  let component: TaskCategoryTreeComponent;
  let fixture: ComponentFixture<TaskCategoryTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCategoryTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCategoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
