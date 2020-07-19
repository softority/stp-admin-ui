import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { tasks } from '../../core/example-data'
import { TaskInfo, TaskViewModel, TaskSectionInfo, MultichoiceTaskData } from '../../core/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'stp-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  constructor(private dataService: DataService) {
    this.loading = true
    dataService.getTasks().pipe(
      //finalize(() => {this.loading = false})
    ).subscribe(data => {
      
      for(let i of data){
        (i.content as MultichoiceTaskData).taskId = i.header.id
      }
      this.tasksVm = data;
      this.loading = false
    });
  }

  ngOnInit(): void {
  }

  loading: boolean;
  tasksVm: TaskViewModel[];
  

  moveTask(event: CdkDragDrop<TaskInfo>) {
    let tmp = this.tasksVm[event.previousIndex];
    this.tasksVm[event.previousIndex] = this.tasksVm[event.currentIndex];
    this.tasksVm[event.currentIndex] = tmp;
  }
}
