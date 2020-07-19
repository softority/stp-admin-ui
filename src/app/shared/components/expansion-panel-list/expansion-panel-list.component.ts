import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

export interface ExpansionPanelTemplateData {
  header: any;
  content: any;
}

@Component({
  selector: 'stp-expansion-panel-list',
  templateUrl: './expansion-panel-list.component.html',
  styleUrls: ['./expansion-panel-list.component.scss']
})
export class ExpansionPanelListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  @Input()
  items: any[];

  @Input()
  headerHeight: string = '120px';

  @Input()
  contentTemplate: TemplateRef<ExpansionPanelTemplateData>;

  @Input()
  headerTemplate: TemplateRef<ExpansionPanelTemplateData>;

  @Output()
  public itemDropped = new EventEmitter<any>();

  drop(event: CdkDragDrop<any>) {
    //console.log(event);
    this.itemDropped.emit(event);
  }

}
