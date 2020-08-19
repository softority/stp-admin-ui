import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskType, TaskComplexity } from 'src/app/core/data-contract';
import { TaskDataService } from 'src/app/core/services/data.service';


export class CreateTaskDialogData {
  title?: string;
  taskCategoryId: number;
}

@Component({
  selector: 'stp-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dataService: TaskDataService,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTaskDialogData) {

    if (data.title) {
      this.title = data.title;
    }

    this.form = fb.group({
      name: [undefined, Validators.required],
      points: [5, [Validators.required, Validators.min(0)]],
      duration: [2, [Validators.required, Validators.min(1)]],
      type: [TaskType.Multichoice, Validators.required],
      complexity: [TaskComplexity.Medium, Validators.required],
    });
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

    if (!this.form.valid) {
      return;
    }
    
    const value = this.form.value;
    this.dialogRef.close({
      taskCategoryId: this.data.taskCategoryId,
      durationMinutes: value.duration,
      complexity: value.complexity,
      name: value.name,
      points: value.points,
      type: value.type
    });

  }
}
