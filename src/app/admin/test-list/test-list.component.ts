import { Component, OnInit } from '@angular/core';
import { sections } from '../../core/example-data'
import { TaskSectionInfo, TaskSectionViewModel } from '../../core/interfaces';
import { TaskInfo } from '../../core/view-models';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EditableLabelState, EditCompletedEventArgs } from 'src/app/shared/components/editable-label/editable-label.component';

@Component({
  selector: 'stp-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {

  sectionNameState: EditableLabelState<string>;
  taskNameState: EditableLabelState<string>;
  sectionsVm: TaskSectionViewModel[] = sections;

  constructor() { }

  ngOnInit(): void {
    // fill sectionId field
    for (let sec of this.sectionsVm) {
      for (let t of sec.tasks) {
        t.section = sec;
      }
    }
  }

  onSectionNameEditCompleted(event: EditCompletedEventArgs<string>, sectionInfo: TaskSectionInfo) {
    sectionInfo.name = event.value;
    sectionInfo.state = {
      value: event.value,
      editMode: false
    }
  }

  onTaskNameEditCompleted(event: EditCompletedEventArgs<string>, taskInfo: TaskInfo) {
    taskInfo.name = event.value;
    taskInfo.state = {
      value: event.value,
      editMode: false
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
    if (tasks === undefined || tasks.length === 0) {
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
