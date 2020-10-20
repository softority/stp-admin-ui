import { Component, OnInit, Input, TemplateRef, ViewChild, AfterViewInit, ContentChild, OnDestroy } from '@angular/core';
import { ExpansionPanelTemplateData } from '../../interfaces';
import { ExpansionPanelHeaderComponent } from '../expansion-panel-header/expansion-panel-header.component';

@Component({
  selector: 'stp-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit, AfterViewInit, OnDestroy  {

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

  // @Input()
  // data: ExpansionPanelTemplateData;

  // // @Input()
  // // contentTemplate: TemplateRef<ExpansionPanelTemplateData>;

  // // @Input()
  // // headerTemplate: TemplateRef<ExpansionPanelTemplateData>;
  
  @ContentChild(ExpansionPanelHeaderComponent)
  headerComponent: ExpansionPanelHeaderComponent;

  //@ViewChild('content') contentElement: HTMLElement;

  isContentHidden: boolean = true;

  // toggleState(event: MouseEvent){
  //   this.isContentHidden = !this.isContentHidden;
  // }
}