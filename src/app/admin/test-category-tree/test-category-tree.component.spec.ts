import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCategoryTreeComponent } from './test-category-tree.component';

describe('TestCategoryTreeComponent', () => {
  let component: TestCategoryTreeComponent;
  let fixture: ComponentFixture<TestCategoryTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCategoryTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCategoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
