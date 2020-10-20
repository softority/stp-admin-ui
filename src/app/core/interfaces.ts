import { TreeNode } from 'src/app/shared/utils/common-utils';
import { EditableLabelState } from '../shared/components/editable-label/editable-label.component';
import { TaskViewModel } from './view-models';

/** File node data with possible child nodes. */
export interface FileNode extends TreeNode {
  id: number;
  name: string;
  type: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  id: number;
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}
export interface TaskSectionViewModel {
  header: TaskSectionInfo;
  tasks: TaskViewModel[];
}

export interface TaskSectionInfo {
  id: number;
  name: string;

  state: EditableLabelState<string>;
}

