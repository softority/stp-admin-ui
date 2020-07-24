import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { MultichoiceTaskData, TaskViewModel } from 'src/app/core/view-models';

@Component({
  selector: 'stp-expansion-panel-sandbox',
  templateUrl: './expansion-panel-sandbox.component.html',
  styleUrls: ['./expansion-panel-sandbox.component.scss']
})
export class ExpansionPanelSandboxComponent implements OnInit {

  constructor(private dataService: DataService) {
    this.loading = true
    dataService.getTasks().pipe(
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

}
