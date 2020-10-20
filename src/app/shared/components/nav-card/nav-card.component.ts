import { Component, OnInit, Input } from '@angular/core';

export interface NavCardItem{
  iconName: string;
  caption: string;
  url: string
}

@Component({
  selector: 'stp-nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent implements OnInit {

  @Input()
  item: NavCardItem;

  constructor() { }

  ngOnInit(): void {
  }
}
