import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest, merge, of } from 'rxjs';
import { startWith, map, concatMap, switchMap, debounceTime, shareReplay, repeat, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { SkillDataService } from 'src/app/core/services/data.service';
import { SkillDto } from 'src/app/core/data-contract';
import { SkillVm, SkillStatus } from 'src/app/core/view-models';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'stp-skills-chips',
  templateUrl: './skills-chips.component.html',
  styleUrls: ['./skills-chips.component.scss']
})
export class SkillsChipsComponent implements OnInit, OnDestroy {

  @Input()
  editMode: boolean;

  @Input()
  processing: boolean;

  // Existing skills
  @Input()
  skills: SkillVm[] = [];

  @Input()
  get visibleSkills(): SkillVm[] {
    const res = this.skills.filter(x => x.status !== SkillStatus.Removed);
    return res;
  }

  //private _prevSkills: SkillVm[];

  @Output()
  skillsChange: EventEmitter<SkillVm[]> = new EventEmitter<SkillVm[]>();

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  filteredSkills$: Observable<SkillVm[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();

  //private allSkills$: Observable<SkillVm[]>;
  private _skillTracker = new Subject<SkillVm[]>();

  constructor(private _dataService: SkillDataService) {

    console.log('SkillsChipsComponent ctor()')

    // TODO: <??> shareReplay is not working as expected!
    const allSkills$ = this._skillTracker.pipe(
      startWith([]),
      switchMap(() => _dataService.getAllSkills().pipe(shareReplay(1))),
      map(x => x.map(y => SkillVm.fromDto(y, SkillStatus.Added))),
      map(x => this.filterByExistingSkills(x))
    );

    // TODO: fix the issue that all skills load from server each time
    // const tmp$ = _dataService.getAllSkills().pipe(
    //   map(x => x.map(y => SkillVm.fromDto(y, SkillState.Added))),
    //   map(x => this.filterByExistingSkills(x)),
    //   shareReplay(1)
    // );
    // const allSkills$ = this._skillTracker.pipe(switchMap(() => tmp$));

    //this.skillCtrl.statusChanges.subscribe((x) => console.log(`statusChanges: ${x}`));
    //this.skillCtrl.valueChanges.subscribe((x) => console.log(`valueChanges: ${JSON.stringify(x)}`));

    const searchText$: Observable<string | null> =
      merge(of(''), this.skillCtrl.valueChanges.pipe(debounceTime(300)));

    this.filteredSkills$ = combineLatest([allSkills$, searchText$])
      .pipe(
        map(([allSkills, searchText]) => searchText ? this.filterBySearchText(allSkills, searchText) : allSkills),
        tap(x => this._filteredSkillsCache = x)
      );
    //this._skillTracker.pipe(switchMap(() => this.filteredSkills$))
  }
  private _filteredSkillsCache: SkillVm[] = [];

  ngOnInit(): void {
    //this._prevSkills = this.skills.slice();
    this._skillTracker.next();
    //this.skillCtrl.setValue('1');
  }

  ngOnDestroy(): void {
    // TODO: unsubscribe
  }

  onBlur(event: Event) {
    //event.stopPropagation();
    console.log(`onblur -> emit: ${JSON.stringify(this.skills)}`);
    this.apply();
  }

  // TODO: <??> return previous state on ESC key
  // undo(event: Event) {
  //   event.stopPropagation
  //   console.log(`onEscape. skills: ${JSON.stringify(this.skills)}`);
  //   this.skills = this._prevSkills.slice();
  //   this._skillTracker.next();
  //   this.trySwitchToViewMode();
  // }

  private apply() {
    console.log(`apply: ${JSON.stringify(this.skills)}`);
    //this._prevSkills = this.skills.slice();
    this.skillsChange.emit(this.skills);
  }
  add(/*skills: string[],*/ event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;

    console.log(`add: ${JSON.stringify(value)}`);

    // Add new skill
    if ((value || '').trim()) {
      const skillName = value.trim();
      // Protection from duplicates:
      // Check if the skill had already been added 
      const adddedSkill = this.skills.find(x => x.name.toLocaleLowerCase() === skillName.toLocaleLowerCase());
      if (!adddedSkill) {
        // or exists in the autocomplete list (when user don't select 
        // skill from autocomplete box and types this skill by hand instead)
        const lookupSkill = this._filteredSkillsCache.find(x => x.name.toLocaleLowerCase() === skillName.toLocaleLowerCase());
        if (lookupSkill) {
          this.addOrRestoreSkill(lookupSkill);
          //this.skills.push(lookupSkill);
          // Refresh autocomplete data.
          this._skillTracker.next();
        }
        else {
          this.addOrRestoreSkill(SkillVm.create(skillName, SkillStatus.New));          
        }
      }
    }
    else {
      // when user just pushes Enter key without adding any skill

      this.apply();
      this.trySwitchToViewMode();
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.skillCtrl.setValue(null);
  }
  private trySwitchToViewMode() {
    if (this.visibleSkills.length > 0) {
      this.editMode = false;
    }
  }
  remove(skill: SkillVm): void {
    console.log(`remove: ${JSON.stringify(skill)}`);

    // in case when skill added and removed before applying changes
    if (skill.status === SkillStatus.Added || skill.status === SkillStatus.New) {
      const index = this.skills.indexOf(skill);

      if (index >= 0) {
        this.skills.splice(index, 1);
      }
    }
    // in case when we are about to remove existed skill
    else if (skill.status === SkillStatus.Unchanged) {
      skill.status = SkillStatus.Removed;
    }
    else {
      console.error(`Adding skill in invalid state: ${JSON.stringify(skill)}`)
    }
    this._skillTracker.next();
  }

  private addOrRestoreSkill(skill: SkillVm) {
    // in case we are adding removed (before apply) skill, that previously existed
    if (skill.status === SkillStatus.Removed) {
      skill.status = SkillStatus.Unchanged;
    }
    else if (skill.status === SkillStatus.Added || skill.status === SkillStatus.New) {
      this.skills.push(skill);
    }
    else {
      console.error(`Adding skill in invalid state: ${JSON.stringify(skill)}`)
    }
  }
  select(event: MatAutocompleteSelectedEvent): void {

    const skill: SkillVm = event.option.value;
    console.log(`select: ${JSON.stringify(skill)}`);

    this.addOrRestoreSkill(skill);

    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
    this._skillTracker.next();
  }

  private filterBySearchText(allSkills: SkillVm[], value: string): SkillVm[] {
    const filterValue = value.toLowerCase();
    return allSkills.filter(x => x.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterByExistingSkills(allSkills: SkillVm[]): SkillVm[] {
    // console.log(`filterByExistingSkills. allSkills.length: ${allSkills.length}`);
    // console.log(`filterByExistingSkills. skills.length: ${this.skills.length}`);

    // remove already chosen skills from autocomplete
    let res = allSkills.filter(x => this.skills.find(y => y.id === x.id) === undefined);
    // add removed items to autocomplete with correct ('Removed') status
    // (from server we have got same items, but with 'Added' status)
    res = [...res, ...this.skills.filter(x => x.status === SkillStatus.Removed)];
    // console.log(`filterByExistingSkills. res.length: ${res.length}`);
    return res;
  }
}
