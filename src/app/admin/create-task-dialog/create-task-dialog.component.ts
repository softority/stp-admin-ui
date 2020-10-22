import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskType, TaskComplexity } from 'src/app/core/data-contract';
import { TaskDataService } from 'src/app/core/services/data.service';
import { SkillVm } from 'src/app/core/view-models';
import { TaskService } from 'src/app/core/services/task.service';


export interface CreateTaskDialogResult {
  //taskCategoryId: number;
  name: string;
  points: number;
  durationMinutes: number;
  complexity: TaskComplexity;
  type: TaskType;
  skills: SkillVm[];
}

// TODO: extend with props that are make sense to set from the outside
export interface CreateTaskDialogData {
  title?: string;
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
  form: FormGroup;
  title: string = "Create new task";
  
  taskTypeValues: number[] = Object.keys(TaskType)
    .filter(k => typeof TaskType[k as any] === "string")
    .map(x => parseInt(x));

  complexityValues: number[] = Object.keys(TaskComplexity)
    .filter(k => typeof TaskComplexity[k as any] === "string")
    .map(x => parseInt(x));

  constructor(
    private _fb: FormBuilder,
    public taskService: TaskService,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent, CreateTaskDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTaskDialogData) {

    if (data.title) {
      this.title = data.title;
    }

    this.form = _fb.group({
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

  getComplexityName(value: number) {
    return TaskComplexity[value];
  }

  save() {
    console.log(`<CreateTaskDialog.save> skills: ${JSON.stringify(this.skills)}`);
    if (!this.form.valid) {
      return;
    }

    const value = this.form.value;
    this.dialogRef.close({
      name: value.name,
      durationMinutes: value.duration,
      complexity: value.complexity,
      points: value.points,
      type: value.type,
      skills: this.skills
    });
  }
}
