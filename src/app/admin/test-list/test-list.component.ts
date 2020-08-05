import { Component, OnInit } from '@angular/core';
import { sections } from '../../core/example-data'
import { TaskSectionInfo, TaskSectionViewModel } from '../../core/interfaces';
import { TaskInfo } from '../../core/view-models';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EditCompletedEventArgs } from 'src/app/shared/editable-label/editable-label.component';
//import { filter, flatMap } from 'rxjs/operators';

@Component({
  selector: 'stp-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // fill sectionId field
    for (let sec of this.sectionsVm) {
      for (let t of sec.tasks) {
        t.section = sec;
      }
    }
  }

  sectionsVm: TaskSectionViewModel[] = sections;

  onTaskNameEditCompleted(event: EditCompletedEventArgs) {
    const taskInfo = event.valueObject as TaskInfo;
    if (!taskInfo) {
      throw new Error('valueObject expected to exist and to be TaskInfo instance');
    }
    if (!event.canceled) {
      taskInfo.name = event.value;
      event.handleValueCallback(true);
    }
  }

  onSectionNameEditCompleted(event: EditCompletedEventArgs) {
    const sectionInfo = event.valueObject as TaskSectionInfo;
    if (!sectionInfo) {
      throw new Error('valueObject expected to exist and to be TaskSectionInfo instance');
    }
    if (!event.canceled) {
      sectionInfo.name = event.value;
      event.handleValueCallback(true);
    }
  }

  moveSection(event: CdkDragDrop<TaskSectionInfo[]>) {
    let tmp = this.sectionsVm[event.previousIndex];
    this.sectionsVm[event.previousIndex] = this.sectionsVm[event.currentIndex];
    this.sectionsVm[event.currentIndex] = tmp;
  }

  moveTask(event: CdkDragDrop<TaskInfo[]>) {
    
    if (event === undefined || event.item == undefined) {
      console.error("Unable to get dropping item data!");
      return;
    }
    const tasks = event.item.data as TaskInfo[];
    if (tasks === undefined || tasks.length === 0){
      console.error("Dropping item data is incorrect!");
      return;
    }
 
    // const tasks = event.item.data.section.tasks;
    // if (tasks === undefined || tasks.length == 0){
    //   alert("Error! Section doesn't have tasks");
    //   return;
    // }

    let tmp = tasks[event.previousIndex];
    tasks[event.previousIndex] = tasks[event.currentIndex];
    tasks[event.currentIndex] = tmp;
  }
}
