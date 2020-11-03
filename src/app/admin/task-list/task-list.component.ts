import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskVm } from '../../core/view-models';
import { ActivatedRoute } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent, CreateTaskDialogResult, CreateTaskDialogData } from '../create-task-dialog/create-task-dialog.component';
import { TaskComplexity, TaskType } from 'src/app/core/data-contract';
import { Observable, Subscription } from 'rxjs';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'stp-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  loading: boolean;
  tasksVm$: Observable<TaskVm[]>;

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
  
  moveTask(event: CdkDragDrop<TaskVm[]>) {
    console.log('moveTask:');
    console.log(event);

    if (event === undefined || event.item == undefined) {
      console.error("Unable to get dropping item data!");
      return;
    }
    const tasks = event.item.data as TaskVm[] ;
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
  }

  private loadData(categoryId: number) {
    this.loading = true;
    this.tasksVm$ = this.taskService.getTasks(categoryId);
  }  
}
