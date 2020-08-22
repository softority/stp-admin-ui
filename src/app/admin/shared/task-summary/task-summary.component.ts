import { Component, OnInit, Input } from '@angular/core';
import { TaskSummaryDto } from 'src/app/core/data-contract';
import { TaskViewModel, TaskInfo, SkillVm } from 'src/app/core/view-models';
import { TaskService } from 'src/app/core/services/task.service';
import { EditCompletedEventArgs } from 'src/app/shared/editable-label/editable-label.component';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { SkillsViewConfig } from '../skills-chips/skills-chips.component';



@Component({
  selector: 'stp-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent implements OnInit {


  @Input()
  task: TaskInfo;

  allSkills$: Observable<SkillVm[]>;

  skillsStateTracker: Subject<SkillsViewConfig> = 
    new Subject<SkillsViewConfig>();

  skillsProcessing: boolean = false;
  skillsProcessingError: string ;
  skillsEditMode: boolean = false;

  constructor(private _taskService: TaskService) {
    this.allSkills$ = _taskService.allSkills$;
  }

  ngOnInit(): void {

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

  onSkillsChange(skills: SkillVm[]) {
    console.log(`onSkillsChange: ${JSON.stringify(skills)}`)
    this.skillsStateTracker.next({processing: true})
    
    this._taskService.updateSkills(this.task.id, skills).subscribe(
      
      res => {
        console.log(`onSkillsChange: callback`)
        this.skillsStateTracker.next({processing: false, editMode: false, error: null})
        if (res) {
          this.task.skills = res.slice();
        }
      },
      err => {
        this.skillsStateTracker.next({processing: false, editMode: true, error: err.error})
      }
    );
  }
}
