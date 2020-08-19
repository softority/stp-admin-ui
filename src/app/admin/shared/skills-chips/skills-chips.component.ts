import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map, concatMap, switchMap, debounceTime, shareReplay } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { SkillDataService } from 'src/app/core/services/data.service';
import { SkillDto } from 'src/app/core/data-contract';

@Component({
  selector: 'stp-skills-chips',
  templateUrl: './skills-chips.component.html',
  styleUrls: ['./skills-chips.component.scss']
})
export class SkillsChipsComponent implements OnInit {

  @Input()
  editMode: boolean;

  @Input()
  processing: boolean;

  @Input()
  skills: SkillDto[];

  @Output()
  skillAdded: EventEmitter<SkillDto>;

  @Output()
  skillRemoved: EventEmitter<SkillDto>;

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  filteredSkills$: Observable<SkillDto[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();

  private allSkills$: Observable<SkillDto[]>;
  private skillChange = new Subject<SkillDto>();

  constructor(private _dataService: SkillDataService) {

    // TODO: fix the issue that all skills load from server each time
    this.allSkills$ = _dataService.getAllSkills();
    const searchText$: Observable<string | null> = this.skillCtrl.valueChanges.pipe(debounceTime(300));

    this.filteredSkills$ = combineLatest([this.allSkills$, searchText$])
      .pipe(
        map(([allSkills, searchText]) => searchText ? this.filter(allSkills, searchText) : allSkills)
      );
    this.skillChange.pipe(switchMap(() => this.filteredSkills$))
  }


  ngOnInit(): void {
    this.skillChange.next();
  }

  finishEditing(event: Event) {
    event.stopPropagation();
    // if (this.skills$.length === 0) {
    //   alert('At least one skill must be set!');
    //   return;
    // }
    this.editMode = false;
  }

  add(/*skills: string[],*/ event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    // TODO: Send data to the server

    // Add our skill
    // if ((value || '').trim()) {
    //   skills.push(value.trim());
    // }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.skillCtrl.setValue(null);
  }

  remove(skill: SkillDto): void {

    this.skillRemoved.emit(skill);
    // const index = this.skills$.indexOf(skill);

    // if (index >= 0) {
    //   this.skills$.splice(index, 1);
    // }

    // TODO: Remove data on the server
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    //this.skills$.push(event.option.value);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private filter(allSkills: SkillDto[], value: string): SkillDto[] {
    const filterValue = value.toLowerCase();
    return allSkills.filter(x => x.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
