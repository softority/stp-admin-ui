import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { tasks } from '../../core/example-data'
import { TaskInfo, TaskViewModel, MultichoiceTaskData } from '../../core/view-models';
import { DataService, TaskInfoDataService } from 'src/app/core/services/data.service';
import { tap, finalize, map } from 'rxjs/operators';
import { EditCompletedEventArgs } from 'src/app/shared/editable-label/editable-label.component';

@Component({
  selector: 'stp-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  constructor(private dataService: TaskInfoDataService) {
    this.loading = true
    dataService.getTasks()
      //finalize(() => {this.loading = false})
      .subscribe(data => {
        this.tasksVm = data.map(x => new TaskViewModel(x));
        for (let i of this.tasksVm) {
          (i.content as MultichoiceTaskData).taskId = i.header.id
        }
        this.loading = false
      });
  }

  ngOnInit(): void {
  }

  loading: boolean;
  tasksVm: TaskViewModel[];

  moveTask(event: CdkDragDrop<TaskInfo>) {
    console.log('moveTask:');
    console.log(event);
    let tmp = this.tasksVm[event.previousIndex];
    this.tasksVm[event.previousIndex] = this.tasksVm[event.currentIndex];
    this.tasksVm[event.currentIndex] = tmp;
  }

  onNameEditCompleted(event: EditCompletedEventArgs) {
    const taskInfo = event.valueObject as TaskInfo;
    if (!taskInfo) {
      throw new Error('valueObject expected to exist and to be TaskInfo instance');
    }
    if (!event.canceled) {
      taskInfo.name = event.value;
      event.handleValueCallback(true);
    }
  }
}
