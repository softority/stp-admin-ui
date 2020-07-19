import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'stp-skills-chips',
  templateUrl: './skills-chips.component.html',
  styleUrls: ['./skills-chips.component.scss']
})
export class SkillsChipsComponent implements OnInit {

  constructor() {
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));
  }

  ngOnInit(): void {
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  
  allSkills: string[] = ['Arrays', '.NET', 'C#', 'Generics'];

  @ViewChild('skillInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input()
  skills: string[];

  @Input()
  editMode: boolean;
   

  // @Input()
  // set editMode(value: boolean){
  //   this._editMode = value;
  //   if (this._editMode)    {
  //     this._editingSkills = this.skills.slice();
  //   }
  //   else{
  //     this._editingSkills = [];
  //   }
  // }
  // get editMode(){
  //   return this._editMode;
  // }

  applySkillsEdit(event: Event){
    event.stopPropagation();
    if (this.skills.length === 0){
      alert('At least one skill must be set!');
      return;
    }
    this.editMode = false;
  }

  add(skills: string[], event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // TODO: Send data to the server

    // Add our skill
    if ((value || '').trim()) {
      skills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.skillCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.skills.indexOf(fruit);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }

    // TODO: Remove data on the server
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
