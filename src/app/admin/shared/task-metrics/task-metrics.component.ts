import { Component, OnInit, Input } from '@angular/core';
import { TaskInfo } from '../../../core/interfaces';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'stp-task-metrics',
  templateUrl: './task-metrics.component.html',
  styleUrls: ['./task-metrics.component.scss']
})
export class TaskMetricsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.pointsCtrl = new FormControl(this.taskInfo.points, [
      Validators.required,
      Validators.min(0),
      Validators.max(999)
    ]);

    this.durationCtrl = new FormControl(this.taskInfo.duration, [
      Validators.required,
      Validators.min(0),
      Validators.max(999)
    ]);

    this.complexityCtrl = new FormControl(this.taskInfo.complexity, [
      Validators.required
    ]);
  }

  @Input()
  taskInfo: TaskInfo;

  // #region points

  pointsCtrl: FormControl;
  pointsEditing: boolean;

  applyPointsEdit(event: Event) {
    event.stopPropagation();
    if (!this.pointsCtrl.valid) {
      return;
    }
    this.taskInfo.points = this.pointsCtrl.value;
    this.pointsEditing = false;
  }

  cancelPointsEdit(event: Event) {
    event.stopPropagation();
    this.pointsCtrl.setValue(this.taskInfo.points);
    this.pointsEditing = false;
  }

  // endregion

  // #region duration

  durationCtrl: FormControl;
  durationEditing: boolean;

  applyDurationEdit(event: Event) {
    event.stopPropagation();
    if (!this.durationCtrl.valid) {
      return;
    }
    this.taskInfo.duration = this.durationCtrl.value;
    this.durationEditing = false;
  }

  cancelDurationEdit(event: Event) {
    event.stopPropagation();
    this.durationCtrl.setValue(this.taskInfo.duration);
    this.durationEditing = false;
  }

  // endregion

  // #region complexity

  complexityEditing: boolean;
  complexityCtrl: FormControl;
  complexityValues: string[] = ['High', 'Medium', 'Low'];

  onComplexityChanged(event:Event) {
    //event.stopPropagation();
    this.taskInfo.complexity = this.complexityCtrl.value;
    this.complexityEditing = false;
  }
// TODO: fix bug: "event.stopPropagation is not a function"
  stopProp(event: Event){
    event.stopPropagation();
  }
  // #endregion complexity


}
