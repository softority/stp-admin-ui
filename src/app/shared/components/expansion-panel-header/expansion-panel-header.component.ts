import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'stp-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrls: ['./expansion-panel-header.component.scss']
})
export class ExpansionPanelHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isContentHidden: boolean = true;

  toggleState(event: MouseEvent){
    this.isContentHidden = !this.isContentHidden;

    this.onToggle.emit(this.isContentHidden);
  }

  @Output()
  public onToggle = new EventEmitter<boolean>();

}
