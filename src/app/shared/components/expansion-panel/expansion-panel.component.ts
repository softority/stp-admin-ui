import { Component, OnInit, Input, TemplateRef, ViewChild, AfterViewInit, ContentChild, OnDestroy } from '@angular/core';
import { ExpansionPanelHeaderComponent } from '../expansion-panel-header/expansion-panel-header.component';

@Component({
  selector: 'stp-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ContentChild(ExpansionPanelHeaderComponent)
  headerComponent: ExpansionPanelHeaderComponent;

  isContentHidden: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.headerComponent.onToggle.unsubscribe();
  }

  ngAfterViewInit(){
    this.headerComponent.onToggle
      .subscribe(x => this.isContentHidden = <boolean>x);
  }
}