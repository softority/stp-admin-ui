import { Component, OnInit, Input } from '@angular/core';
import { TaskInfo } from '../../../core/view-models';
import { FormControl, Validators } from '@angular/forms';
import { EditCompletedEventArgs, EditableLabelState } from 'src/app/shared/components/editable-label/editable-label.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { TaskService } from 'src/app/core/services/task.service';
import { TaskComplexity } from 'src/app/core/data-contract';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'stp-task-metrics',
  templateUrl: './task-metrics.component.html',
  styleUrls: ['./task-metrics.component.scss']
})
export class TaskMetricsComponent implements OnInit {

  pointsTracker: BehaviorSubject<EditableLabelState<number>>;
  durationTracker: BehaviorSubject<EditableLabelState<number>>;

  private _taskInfo: TaskInfo;

  @Input()
  set taskInfo(value: TaskInfo){
    this._taskInfo = value;
    this.pointsTracker = new BehaviorSubject<EditableLabelState<number>>({value: this._taskInfo.points});
    this.durationTracker = new BehaviorSubject<EditableLabelState<number>>({value: this._taskInfo.duration});
  }

  get taskInfo(): TaskInfo{
    return this._taskInfo;
  }

  constructor(private _taskService: TaskService) { 
    
  }

  ngOnInit(): void {
    console.log(`TaskMetricsComponent.ctro. taskInfo: ${JSON.stringify(this.taskInfo)}`);
    this.complexityCtrl = new FormControl(this.taskInfo.complexity, [
      Validators.required
    ]);
  }

  onPointsEditCompleted(event: EditCompletedEventArgs<number>) {
    const points = event.value;
    this.pointsTracker.next({ processing: true });
    this._taskService.updateTaskPoints(this.taskInfo.id, points).subscribe(
      () => {
        this.taskInfo.points = points;
        this.pointsTracker.next({ value: points, processing: false, editMode: false, error: null });
      },
      (err) => {
        this.pointsTracker.next({ processing: false, editMode: false, error: err.error });
      }
    );    
  }

  onDurationEditCompleted(event: EditCompletedEventArgs<number>) {
    const duration = event.value;
    this.durationTracker.next({ processing: true });
    this._taskService.updateTaskDuration(this.taskInfo.id, duration).subscribe(
      () => {
        this.taskInfo.duration = duration;
        this.durationTracker.next({ value: duration, processing: false, editMode: false, error: null });
      },
      (err) => {
        this.durationTracker.next({ processing: false, editMode: false, error: err.error });
      }
    );    
  }

  // #region complexity

  complexityEditMode: boolean;
  complexityCtrl: FormControl;
  complexityError: string;
  //complexityValues: string[] = ['High', 'Medium', 'Low'];
  
  getComplexityName(value: number) {
    return TaskComplexity[value];
  }
  complexityValues: number[] = Object.keys(TaskComplexity)
    .filter(k => typeof TaskComplexity[k as any] === "string")
    .map(x => parseInt(x));


  onComplexityChanged(event: Event) {
    //event.stopPropagation();
    if (!this.complexityCtrl.valid){
      return;
    }
    const complexity = <TaskComplexity>this.complexityCtrl.value;
    this._taskService.updateTaskComplexity(this.taskInfo.id, complexity).subscribe(
      () => {
        this.complexityError = null;
        this.taskInfo.complexity = complexity;
      },
      (err) => {
        this.complexityError = err.error;
        this.complexityCtrl.setValue(this.taskInfo.complexity);
      }
    );
    this.taskInfo.complexity = this.complexityCtrl.value;
    this.complexityEditMode = false;
  }
  // TODO: fix bug: "event.stopPropagation is not a function"
  stopProp(event: Event) {
    event.stopPropagation();
  }

  // #endregion complexity

}
