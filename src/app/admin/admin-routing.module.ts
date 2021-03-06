import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TestsLayoutComponent } from './tests-layout/tests-layout.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TestListComponent } from './test-list/test-list.component';
import { TaskLayoutComponent } from './task-layout/task-layout.component';


const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      {
        path: 'tests', component: TestsLayoutComponent,
        data: {title: 'Tests'},
        children: [
          { path: ':id', component: TestListComponent }
        ]
      },
      {
        path: 'tasks', component: TaskLayoutComponent,
        data: {title: 'Tasks'},
        children: [
          { path: ':id', component: TaskListComponent }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

