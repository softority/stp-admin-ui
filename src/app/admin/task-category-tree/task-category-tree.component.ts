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
import { TaskCategoryDataService } from 'src/app/core/services/data.service';
import { TaskCategoryDto, CreateCategoryCommand } from 'src/app/core/data-contract';
import { arrayToTree, Item, TreeItem, Config } from 'src/app/shared/utils/arrayToTree';
import { TaskCategoryVm } from 'src/app/core/view-models';


@Component({
  selector: 'stp-task-category-tree',
  templateUrl: './task-category-tree.component.html',
  styleUrls: ['./task-category-tree.component.scss']
})
export class TaskCategoryTreeComponent {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _dataService: TaskCategoryDataService
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer.bind(this),
      this.getLevel.bind(this),
      this.isExpandable.bind(this),
      this.getChildren.bind(this));

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.loadData();

  }

  loading: boolean;

  private loadData() {
    this.loading = true;
    this._dataService.getCategories()
      .subscribe(x => {
        this.loading = false;
        const tree = arrayToTree(x, { dataField: null });
        this.dataSource.data = tree;
      });
  }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<TreeItem, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<TreeItem, FlatTreeNode>;

  private _selectedNode: FlatTreeNode;

  /** Transform the data to something the tree can read. */
  transformer(node: TreeItem, level: number) {
    //const children = this.dataSource.data.filter(x => x.parentId === node.id);
    //const hasChildren = (children && children.length > 0);

    return {
      id: node.id,
      name: node.name,
      // TODO: change to 'category'
      type: 'folder', // in task category tree only one type of nodes
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
  getChildren(node: TreeItem): TreeItem[] | null | undefined {
    // if (!node)
    //   return null;
    //const res = this.dataSource.data.filter(x => x.parentId === node.id)    
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
      throw new Error('Unexpected node type (' + node.type + ')!');
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
        if (!res) {
          return;
        }
        const nodes = this.dataSource.data;
        const cmd: CreateCategoryCommand = { name: res };

        // if parentId is not defined - then add to the root
        if (parentNode !== undefined) {
          cmd.parentCategoryId = parentNode.id;
        }

        this._dataService.createCategory(cmd).subscribe
          (
            (val) => {
              this.loadData();

              // if (parentNode !== undefined) {
              //   const parent = findNode<TreeItem>(nodes, x => x.id === parentNode.id);

              //   if (!parent){
              //     throw new Error('Unexpected error! Failed to find parent node.');
              //   }
              //   parent.children.push(val);
              // }
              // else{
              //   nodes.push(val); 
              // }
              // this.dataSource.data = nodes; 
            },
            (err) => { alert(err.error); }
          );
      })
  }

  private renameCategory(node: FlatTreeNode) {
    this.openPromptDialog(
      {
        title: 'Rename category',
        placeholder: 'Name',
        name: node.name
      })
      .subscribe(newName => {
        if (newName !== undefined) {
          const nodes = this.dataSource.data;
          const n = nodes.find(x => x.id === node.id);

          this._dataService.updateCategoryName(node.id, newName)
            .subscribe(
              (res) => {
                this.loadData();
                // n.name = newName;
                // this.dataSource.data = nodes;
              },
              (err) => {
                alert(err.error);
              });
        }
      });
  }
  private deleteCategory(node: FlatTreeNode) {
    this.openConfirmationDialog(
      {
        title: 'Delete category ' + node.name + '. Are you shure?'
      })
      .subscribe(ok => {
        if (ok) {
          this._dataService.deleteCategory(node.id)
            .subscribe(
              (res) => {
                this.loadData();
                // n.name = newName;
                // this.dataSource.data = nodes;
              },
              (err) => {
                alert(err.error);
              });
        }
      });
  }

  // #endregion

}
