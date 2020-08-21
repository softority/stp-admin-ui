import { Component, OnInit, Input } from '@angular/core';
import { TaskSummaryDto } from 'src/app/core/data-contract';
import { TaskViewModel, TaskInfo, SkillVm } from 'src/app/core/view-models';
import { TaskService } from 'src/app/core/services/task.service';
import { EditCompletedEventArgs } from 'src/app/shared/editable-label/editable-label.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'stp-task-summary',
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent implements OnInit {


  @Input()
  task: TaskInfo;
  allSkills$: Observable<SkillVm[]>;

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

  onSkillsChange(skills: SkillVm[]){
    
    this._taskService.updateSkills(this.task.id, skills).subscribe(
      res => {
        if (res){
          console.log(`updateSkills ${JSON.stringify(res)}`);
          this.task.skills = res.slice();
        }
      }
    );
  }
}
