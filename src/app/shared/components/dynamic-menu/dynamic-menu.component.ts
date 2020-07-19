import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

export interface DynamicMenuData {
  
    items: DynamicMenuItemData[]    
  
}
export interface DynamicMenuItemData {
    name: string;
    action: Function;
}

@Component({
  selector: 'stp-dynamic-menu',
  templateUrl: './dynamic-menu.component.html',
  styleUrls: ['./dynamic-menu.component.scss'],
  exportAs: 'dynamic-menu'
})
export class DynamicMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // @Input()
  // items: ContextMenuItemData[];

  @ViewChild('appMenu', {static: true}) menu: MatMenu;

  handleMenuAction(action: Function) {
    action();
  }
}
