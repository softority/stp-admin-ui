import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SbxRoutingModule } from './sbx-routing.module';
import { SbxComponent } from './sbx.component';
import { SbxLayoutComponent } from './sbx-layout/sbx-layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SbxAddressComponent } from './sbx-address/sbx-address.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { SbxTableComponent } from './sbx-table/sbx-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SbxDashboardComponent } from './sbx-dashboard/sbx-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { SbxTreeComponent } from './sbx-tree/sbx-tree.component';
import { MatTreeModule } from '@angular/material/tree';
import { SbxDragDropComponent } from './sbx-drag-drop/sbx-drag-drop.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [SbxComponent, SbxLayoutComponent, SbxAddressComponent, SbxTableComponent, SbxDashboardComponent, SbxTreeComponent, SbxDragDropComponent],
  imports: [
    CommonModule,
    SbxRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatMenuModule,
    MatTreeModule,
    DragDropModule
  ]
})
export class SbxModule { }
