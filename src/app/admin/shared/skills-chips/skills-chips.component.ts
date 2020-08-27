import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest, merge, of, Subscription } from 'rxjs';
import { startWith, map, concatMap, switchMap, debounceTime, shareReplay, repeat, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { SkillDataService } from 'src/app/core/services/data.service';
import { SkillVm, SkillStatus } from 'src/app/core/view-models';
import { state } from '@angular/animations';

export interface SkillsViewState {
  editMode?: boolean;
  processing?: boolean;
  error?: string;
}

@Component({
  selector: 'stp-skills-chips',
  templateUrl: './skills-chips.component.html',
  styleUrls: ['./skills-chips.component.scss']
})
export class SkillsChipsComponent implements OnInit, OnDestroy {

  // Existing skills
  @Input()
  set skills(value: SkillVm[]) {
    console.log(`SET SKILLS: ${JSON.stringify(value)}`);
    this._skills = value;
    this._prevSkills = this._skills.map(x => Object.assign({}, x));
  }
  get skills(): SkillVm[] {
    return this._skills;
  }

  @Input ()
  viewModeOff: boolean;

  @Input()
  allSkills$: Observable<SkillVm[]>;

  @Input()
  state$: Observable<SkillsViewState>;

  get editMode(): boolean {
    return this._editMode;
  }

  @Input()
  set editMode(value: boolean) {
    console.log(`set editMode=${value}, visibleSkills.length=${this.visibleSkills.length}`);
    if (!value) {
      if (this.viewModeOff) {
        // view mode without items is forbidden
        return;
      }
      this.error = undefined;
    }
    this._editMode = value;
  }

  processing: boolean;
  error: string;

  get visibleSkills(): SkillVm[] {
    const res = this.skills.filter(x => x.status !== SkillStatus.Removed);
    //console.log(`visibleSkills: ${JSON.stringify(res)}`);
    return res;
  }

  @Output()
  skillsChange: EventEmitter<SkillVm[]> = new EventEmitter<SkillVm[]>();

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  filteredSkills$: Observable<SkillVm[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();

  private _skillTracker = new Subject<SkillVm[]>();
  private _skills: SkillVm[] = [];
  private _prevSkills: SkillVm[];
  private _editMode: boolean;
  private _subscription: Subscription = new Subscription();

  constructor(private _dataService: SkillDataService) {

    console.log('SkillsChipsComponent ctor()')

    // const allSkills$ = this._skillTracker.pipe(
    //   startWith([]),
    //   switchMap(() => _dataService.getAllSkills().pipe(shareReplay(1))),
    //   map(x => x.map(y => SkillVm.fromDto(y, SkillStatus.Added))),
    //   map(x => this.filterByExistingSkills(x))
    // );



    // TODO: fix the issue that all skills load from server each time
    // const tmp$ = _dataService.getAllSkills().pipe(
    //   map(x => x.map(y => SkillVm.fromDto(y, SkillState.Added))),
    //   map(x => this.filterByExistingSkills(x)),
    //   shareReplay(1)
    // );
    // const allSkills$ = this._skillTracker.pipe(switchMap(() => tmp$));

    //this.skillCtrl.statusChanges.subscribe((x) => console.log(`statusChanges: ${x}`));
    //this.skillCtrl.valueChanges.subscribe((x) => console.log(`valueChanges: ${JSON.stringify(x)}`));


    //this._skillTracker.pipe(switchMap(() => this.filteredSkills$))
  }
  private _filteredSkillsCache: SkillVm[] = [];

  ngOnInit(): void {
    
    if (this.viewModeOff){
      this.editMode = true;
    }

    if (this.state$) {
      const s = this.state$.subscribe(x => {
        if (x.editMode !== undefined) {
          this.editMode = x.editMode;
        }
        if (x.processing !== undefined) {
          this.processing = x.processing;
        }
        if (x.error !== undefined) {
          this.error = x.error;
        }
      });
      this._subscription.add(s);
    }
    const skillsWithoutAdded$ = this._skillTracker.pipe(
      startWith([]),
      switchMap(() => this.allSkills$.pipe(
        map(x => this.filterByExistingSkills(x))
      ))
    );

    const searchText$: Observable<string | null> =
      merge(of(''), this.skillCtrl.valueChanges.pipe(debounceTime(300)));

    this.filteredSkills$ = combineLatest([skillsWithoutAdded$, searchText$])
      .pipe(
        map(([allSkills, searchText]) => searchText ? this.filterBySearchText(allSkills, searchText) : allSkills),
        tap(x => this._filteredSkillsCache = x)
      );
  }

  // TODO: check all subscriptions on unsubscribing
  ngOnDestroy(): void {
    console.log('SkillsChipsComponent.OnDestroy')
    this._subscription.unsubscribe();
  }

  // onBlur(event: Event) {
  //   //event.stopPropagation();
  //   console.log(`onblur -> emit: ${JSON.stringify(this.skills)}`);
  //   this.apply();
  // }

  undo(event: Event) {
    event.stopPropagation();
    // Undo avaliable only of view mode turned on
    if (this.viewModeOff)
    {
      return;
    }
    this.skills = this._prevSkills.slice();
    console.log(`onEscape. skills: ${JSON.stringify(this.skills)}`);
    this._skillTracker.next();

    this.editMode = false;
  }
  onEnter(event: Event) {
    event.stopPropagation();
    console.log(`onEnter.`);
    this.apply();
  }
  apply() {
    console.log(`apply: ${JSON.stringify(this.skills)}`);
    console.log(`apply prevSkills: ${JSON.stringify(this._prevSkills)}`);
    this._prevSkills = this.skills.slice();
    this.skillsChange.emit(this.skills);
    if (!this.state$)
    {
      this.editMode = false;
    }
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

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.skillCtrl.setValue(null);
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

  select(event: MatAutocompleteSelectedEvent): void {

    const skill: SkillVm = event.option.value;
    console.log(`select: ${JSON.stringify(skill)}`);

    this.addOrRestoreSkill(skill);

    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
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
    console.log(`addOrRestoreSkill: ${JSON.stringify(skill)}`);
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
