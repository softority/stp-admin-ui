import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TestsTreeComponent } from '../tests-tree/tests-tree.component';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'stp-tests-layout',
  templateUrl: './tests-layout.component.html',
  styleUrls: ['./tests-layout.component.scss']
})
export class TestsLayoutComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

  }

  // @ViewChild(TestsTreeComponent)
  // tree: TestsTreeComponent;
  
  // @ViewChild(MatMenuTrigger) 
  // trigger: MatMenuTrigger;

  // contextMenuPosition = { x: '0px', y: '0px' };

  // onMouseRightClick(event: MouseEvent) {

  //   event.preventDefault();

  //   if (this.trigger.menuOpened) {
  //     this.trigger.closeMenu();
  //   }

  //   this.contextMenuPosition.x = event.clientX + 'px';
  //   this.contextMenuPosition.y = event.clientY + 'px';

  //   this.trigger.menuData = {
  //     items: [
  //       { name: 'Add category', action: this.tree.addCategory.bind(this.tree, undefined) },
  //     ]
  //   }
  //   this.trigger.menu.focusFirstItem('mouse');
  //   this.trigger.openMenu();
  // }

}
