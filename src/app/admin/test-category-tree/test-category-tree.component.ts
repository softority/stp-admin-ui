import { Component, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { files } from '../../core/example-data';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicMenuData } from '../../shared/components/dynamic-menu/dynamic-menu.component'
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PromptDialogData, PromptDialogComponent } from 'src/app/shared/components/prompt-dialog/prompt-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmationDialogData, ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TreeNode, findNode } from 'src/app/shared/utils/common-utils';
import { FlatTreeNode, FileNode } from '../../core/interfaces';


@Component({
  selector: 'stp-test-category-tree',
  templateUrl: './test-category-tree.component.html',
  styleUrls: ['./test-category-tree.component.scss']
})
export class TestCategoryTreeComponent {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = files;
  }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  private _selectedNode: FlatTreeNode;

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      level: level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }

  isNodeSelected(node: FlatTreeNode) {
    let res = node === this._selectedNode;
    return res;
  }

  onNodeClick(node: FlatTreeNode) {
    if (node.id !== undefined) {
      this._selectedNode = node;

      this._router.navigate([node.id], { relativeTo: this._route });
    }
  }

  contextMenuPosition = { x: '0px', y: '0px' };

  onNodeRightClick(event: MouseEvent, node: FlatTreeNode) {
    event.preventDefault();

    if (this.trigger.menuOpened) {
      this.trigger.closeMenu();
    }

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    this.trigger.menuData = this.getContextMenuData(node);
    this.trigger.menu.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  onTreeRightClick(event: MouseEvent) {

    event.preventDefault();

    if (this.trigger.menuOpen) {
      return;
    }

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    this.trigger.menuData = {
      items: [
        { name: 'Add category', action: this.addCategory.bind(this, undefined) },
      ]
    }
    this.trigger.menu.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  getContextMenuData(node: FlatTreeNode): DynamicMenuData {
    if (node.type === 'folder') {
      return {
        items: [
          { name: 'Add category', action: this.addCategory.bind(this, node) },
          { name: 'Rename', action: this.renameCategory.bind(this, node) },
          { name: 'Delete', action: this.deleteCategory.bind(this, node) },
        ]
      }
    }
    else {
      throw new Error('Unexpected node type ('+ node.type +')!');
    }
  }
  
  private openConfirmationDialog(data: ConfirmationDialogData): Observable<boolean> {
    const config = new MatDialogConfig();

    config.disableClose = true;
    config.autoFocus = true;
    config.data = data;

    const dialogRef = this._dialog.open(ConfirmationDialogComponent, config);

    return dialogRef.afterClosed()
  }
  private openPromptDialog(data: PromptDialogData): Observable<string> {

    const config = new MatDialogConfig();

    config.disableClose = true;
    config.autoFocus = true;
    config.data = data;

    const dialogRef = this._dialog.open(PromptDialogComponent, config);

    return dialogRef.afterClosed()
  }

  // #region Category actions

  private addCategory(parentNode: FlatTreeNode) {
    this.openPromptDialog(
      {
        title: 'Add new category',
        placeholder: 'Category name'
      })
      .subscribe(res => {
        if (name === undefined) {
          return;
        }
        const nodes = this.dataSource.data;

        // if parentId is not defined - then add to the root
        if (parentNode === undefined) {
          nodes.push({ id: (Math.random() * 10000), name: res, type: 'folder' })
        }
        else {
          const parent = findNode<FileNode>(nodes, x => x.type === 'folder' && x.id === parentNode.id);

          if (parent === undefined) {
            alert('Unexpected error! Please contact support.');
            return;
          }
          if (parent.children === undefined) {
            parent.children = [];
          }
          parent.children.push({ id: (Math.random() * 10000), name: res, type: 'folder' });
        }
        this.dataSource.data = nodes;
      })
  }

  private renameCategory(node: FlatTreeNode) {
    this.openPromptDialog(
      {
        title: 'Rename category',
        placeholder: 'Name',
        name: node.name
      })
      .subscribe(res => {
        if (res !== undefined) {
          const nodes = this.dataSource.data;
          const n = findNode<FileNode>(nodes, x => x.type === node.type && x.id === node.id);
          n.name = res;
          this.dataSource.data = nodes;
        }
      });
  }
  private deleteCategory(categoryName: string) {
    this.openConfirmationDialog(
      {
        title: 'Delete category ' + categoryName + '. Are you shure?'
      })
      .subscribe(res => {
        if (res !== undefined) {
          // TODO
          alert(res);
        }
      });
  }

  // #endregion

}
