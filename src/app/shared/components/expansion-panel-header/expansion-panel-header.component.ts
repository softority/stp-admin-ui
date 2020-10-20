import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'stp-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrls: ['./expansion-panel-header.component.scss']
})
export class ExpansionPanelHeaderComponent implements OnInit {

  isContentHidden: boolean = true;

  @Output()
  public onToggle = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleState(event: MouseEvent){
    this.isContentHidden = !this.isContentHidden;
    this.onToggle.emit(this.isContentHidden);
  }
}
