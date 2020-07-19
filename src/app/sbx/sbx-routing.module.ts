import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SbxComponent } from './sbx.component';
import { SbxLayoutComponent } from './sbx-layout/sbx-layout.component';
import { SbxAddressComponent } from './sbx-address/sbx-address.component';
import { SbxTableComponent } from './sbx-table/sbx-table.component';
import { SbxDashboardComponent } from './sbx-dashboard/sbx-dashboard.component';
import { SbxTreeComponent } from './sbx-tree/sbx-tree.component';
import { SbxDragDropComponent } from './sbx-drag-drop/sbx-drag-drop.component';

const routes: Routes = [
  {
    path: '', 
    component: SbxLayoutComponent,
    children: [
      { path: '', component: SbxDashboardComponent },
      { path: 'addr', component: SbxAddressComponent },
      { path: 'tab', component: SbxTableComponent },
      { path: 'tree', component: SbxTreeComponent },
      { path: 'dd', component: SbxDragDropComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SbxRoutingModule { }
