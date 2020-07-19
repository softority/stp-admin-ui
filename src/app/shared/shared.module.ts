import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavCardComponent } from './components/nav-card/nav-card.component';
import { RouterModule } from '@angular/router';
import { DynamicMenuComponent } from './components/dynamic-menu/dynamic-menu.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';

import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ExpansionPanelListComponent } from './components/expansion-panel-list/expansion-panel-list.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


const dialogs = [
  ConfirmationDialogComponent,
  PromptDialogComponent
];

@NgModule({
  declarations: [
    NavCardComponent,
    DynamicMenuComponent,
    PromptDialogComponent,
    ...dialogs,
    ExpansionPanelListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,    
    DragDropModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavCardComponent,
    DynamicMenuComponent,
    ExpansionPanelListComponent,
    DragDropModule
  ],
  entryComponents: [
    ...dialogs
  ]
})
export class SharedModule { }
