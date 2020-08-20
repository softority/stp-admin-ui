import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskType, TaskComplexity } from 'src/app/core/data-contract';
import { TaskDataService } from 'src/app/core/services/data.service';
import { SkillVm } from 'src/app/core/view-models';


export interface CreateTaskDialogResult{
  //taskCategoryId: number;
  name: string;
  points: number;
  durationMinutes: number;
  complexity: TaskComplexity;
  type: TaskType;
  skills: SkillVm[];
}
// TODO: extend with props which are make sense to set from the outside
// TOOD: remove taskCategoryId - it is just transit field
export interface CreateTaskDialogData {
  title?: string;
  //taskCategoryId: number;

  points?: number;
  durationMinutes?: number;
  complexity?: TaskComplexity;
  type?: TaskType;
  skills?: SkillVm[];
}

@Component({
  selector: 'stp-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {

  skills: SkillVm[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: TaskDataService,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent, CreateTaskDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTaskDialogData) {

    if (data.title) {
      this.title = data.title;
    }

    this.form = fb.group({
      name: [undefined, Validators.required],
      points: [data.points, [Validators.required, Validators.min(0)]],
      duration: [data.durationMinutes, [Validators.required, Validators.min(1)]],
      type: [data.type, Validators.required],
      complexity: [data.complexity, Validators.required],
    });

    // TODO: embed <stp-skills-chips> as form control (via ControlValueAccessor)
    this.skills = data.skills ?? [];
  }

  ngOnInit(): void {

  }

  getTaskTypeName(value: number) {
    return TaskType[value];
  }
  taskTypeValues: number[] = Object.keys(TaskType)
    .filter(k => typeof TaskType[k as any] === "string")
    .map(x => parseInt(x));

  getComplexityName(value: number) {
    return TaskComplexity[value];
  }
  complexityValues: number[] = Object.keys(TaskComplexity)
    .filter(k => typeof TaskComplexity[k as any] === "string")
    .map(x => parseInt(x));

  form: FormGroup;
  title: string = "Create new task";

  save() {
    console.log(`<CreateTaskDialog.save> skills: ${JSON.stringify(this.skills)}`);
    if (!this.form.valid) {
      return;
    }
    
    const value = this.form.value;
    this.dialogRef.close({
      //taskCategoryId: this.data.taskCategoryId,
      name: value.name,
      durationMinutes: value.duration,
      complexity: value.complexity,      
      points: value.points,
      type: value.type,
      skills: this.skills
    });

  }
}
