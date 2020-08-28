import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { tasks } from '../../core/example-data'
import { TaskInfo, TaskViewModel, MultichoiceTaskData, SkillStatus, SkillVm } from '../../core/view-models';
import { DataService, TaskDataService } from 'src/app/core/services/data.service';
import { tap, finalize, map, switchMap, catchError } from 'rxjs/operators';
import { EditCompletedEventArgs } from 'src/app/shared/editable-label/editable-label.component';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent, CreateTaskDialogResult, CreateTaskDialogData } from '../create-task-dialog/create-task-dialog.component';
import { TaskDto, TaskComplexity, TaskType, SkillStateDto, SkillState } from 'src/app/core/data-contract';
import { error } from '@angular/compiler/src/util';
import { throwError, Observable, Subscription } from 'rxjs';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'stp-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  loading: boolean;
  tasksVm$: Observable<TaskViewModel[]>;

  private _categoryId: number;
  private _subscription = new Subscription();

  constructor(private taskService: TaskService,
    private _dialog: MatDialog,
    private route: ActivatedRoute) {

    route.params.subscribe(x => {
      this._categoryId = parseInt(x?.id);
      if (this._categoryId === undefined) {
        throw new Error("Failed to get task id from the route");
      }
      else {
        this.loadData(this._categoryId);
      }
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  createTask() {

    const config = new MatDialogConfig<CreateTaskDialogData>();

    config.disableClose = true;
    config.autoFocus = true;
    config.data =
    {
      //taskCategoryId: this._categoryId,
      complexity: TaskComplexity.Medium,
      durationMinutes: 2,
      points: 5,
      type: TaskType.Multichoice
    };

    const dialogRef = this._dialog
      .open<CreateTaskDialogComponent, CreateTaskDialogData, CreateTaskDialogResult>(
        CreateTaskDialogComponent, config);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.taskService.createTask(res)
        .subscribe(() => console.log('subscription: createTask'));
      }
    })
  }
  
  moveTask(event: CdkDragDrop<TaskViewModel[]>) {
    console.log('moveTask:');
    console.log(event);

    if (event === undefined || event.item == undefined) {
      console.error("Unable to get dropping item data!");
      return;
    }
    const tasks = event.item.data as TaskViewModel[] ;
    if (tasks === undefined || tasks.length === 0) {
      console.error("Dropping item data is incorrect!");
      return;
    }
    const taskId = tasks[event.previousIndex].header.id;
    const newPosition = tasks[event.currentIndex].header.position;

    this._subscription.add(
      this.taskService.updateTaskPosition(taskId, newPosition)
        .subscribe(() => console.log('subscription: updateTaskPosition'))
    );

    // let tmp = this.tasksVm[event.previousIndex];
    // this.tasksVm[event.previousIndex] = this.tasksVm[event.currentIndex];
    // this.tasksVm[event.currentIndex] = tmp;
  }

  

  private loadData(categoryId: number) {
    this.loading = true;
    this.tasksVm$ = this.taskService.getTasks(categoryId);
  }  
}
