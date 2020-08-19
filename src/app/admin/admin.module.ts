import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TestsLayoutComponent } from './tests-layout/tests-layout.component';
import { TestsTreeComponent } from './tests-tree/tests-tree.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TestListComponent } from './test-list/test-list.component';
import { TaskCategoryTreeComponent } from './task-category-tree/task-category-tree.component';
import { TaskLayoutComponent } from './task-layout/task-layout.component';
import { MultichoiceTaskDetailsComponent } from './shared/multichoice-task-details/multichoice-task-details.component';
import { SkillsChipsComponent } from './shared/skills-chips/skills-chips.component';
import { TaskNameComponent } from './shared/task-name/task-name.component';
import { TaskMetricsComponent } from './shared/task-metrics/task-metrics.component';
import { ExpansionPanelSandboxComponent } from './expansion-panel-sandbox/expansion-panel-sandbox.component';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminLayoutComponent,
    AdminDashboardComponent,
    TestsLayoutComponent,
    TestsTreeComponent,
    TaskListComponent,
    TestListComponent,
    TaskCategoryTreeComponent,
    TaskLayoutComponent,
    MultichoiceTaskDetailsComponent,
    SkillsChipsComponent,
    TaskNameComponent,
    TaskMetricsComponent,
    ExpansionPanelSandboxComponent,
    CreateTaskDialogComponent],
  imports: [
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
