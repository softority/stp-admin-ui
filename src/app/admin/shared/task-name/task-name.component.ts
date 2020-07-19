import { Component, OnInit, Input } from '@angular/core';
import { TaskInfo } from '../../../core/interfaces';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'stp-task-name',
  templateUrl: './task-name.component.html',
  styleUrls: ['./task-name.component.scss']
})
export class TaskNameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.nameCtrl = new FormControl(this.taskInfo?.name, Validators.required);
  }

  nameCtrl: FormControl;
  nameEditing: boolean = false;

  @Input()
  taskInfo: TaskInfo;
  
  applyNameEdit(event:Event){
    event.stopPropagation();
    if (!this.nameCtrl.valid){
      return;
    }

    this.taskInfo.name = this.nameCtrl.value;
    this.nameEditing = false;
  }

  cancelNameEdit(event:Event){
    event.stopPropagation();
    this.nameCtrl.setValue(this.taskInfo.name);
    this.nameEditing = false;
  }

}
