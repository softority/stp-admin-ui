import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsChipsComponent } from './skills-chips.component';

describe('SkillsChipsComponent', () => {
  let component: SkillsChipsComponent;
  let fixture: ComponentFixture<SkillsChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
