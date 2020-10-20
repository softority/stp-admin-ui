import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ExpansionPanelTemplateData } from '../../interfaces';

@Component({
  selector: 'stp-expansion-panel-list',
  templateUrl: './expansion-panel-list.component.html',
  styleUrls: ['./expansion-panel-list.component.scss']
})
export class ExpansionPanelListComponent implements OnInit {

  @Input()
  items: any[];

  @Input()
  contentTemplate: TemplateRef<ExpansionPanelTemplateData>;

  @Input()
  headerTemplate: TemplateRef<ExpansionPanelTemplateData>;

  @Output()
  public itemDropped = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {

  }

  drop(event: CdkDragDrop<any>) {
    event.item.data = this.items;
    console.log(event);    
    this.itemDropped.emit(event);
  }
}
