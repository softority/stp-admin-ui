import { Component, OnInit, Input } from '@angular/core';
import { TaskSummaryDto } from 'src/app/core/data-contract';
import { TaskViewModel, TaskInfo, SkillVm } from 'src/app/core/view-models';
import { TaskService } from 'src/app/core/services/task.service';
import { EditCompletedEventArgs, EditableLabelState } from 'src/app/shared/components/editable-label/editable-label.component';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { SkillsViewState } from '../skills-chips/skills-chips.component';

@Component({
  selector: 'stp-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent implements OnInit {

  @Input()
  set task(value: TaskInfo){
    this._task = value;
    this.nameStateTracker = new BehaviorSubject<EditableLabelState<string>>({value: this._task.name});
  }
  get task(): TaskInfo{
    return this._task;
  }

  skillsStateTracker: Subject<SkillsViewState> = new Subject<SkillsViewState>();
  nameStateTracker: BehaviorSubject<EditableLabelState<string>>;

  private _task: TaskInfo;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    this.nameStateTracker.next({ value: this.task.name});
  }

  onNameEditCompleted(event: EditCompletedEventArgs<string>) {
    this.nameStateTracker.next({ processing: true });
    const newName = event.value;

    this.taskService.updateTaskName(this.task.id, newName).subscribe(
      () => {
        this.task.name = newName;
        this.nameStateTracker.next({ value:newName, processing: false, editMode: false, error: null });
      },
      (err) => {
        this.nameStateTracker.next({ processing: false, editMode: true, error: err.error });
      }
    );
  }

  onSkillsChange(skills: SkillVm[]) {
    console.log(`onSkillsChange: ${JSON.stringify(skills)}`)
    this.skillsStateTracker.next({ processing: true })

    this.taskService.updateSkills(this.task.id, skills).subscribe(

      res => {
        console.log(`onSkillsChange: callback`)
        this.skillsStateTracker.next({ processing: false, editMode: false, error: null })
        if (res) {
          this.task.skills = res.slice();
        }
      },
      err => {
        this.skillsStateTracker.next({ processing: false, editMode: true, error: err.error })
      }
    );
  }
}
