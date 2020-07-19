import { TreeNode } from 'src/app/shared/utils/common-utils';

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

export interface TaskViewModel {
  section?: TaskSectionViewModel;
  header: TaskInfo;
  content: MultichoiceTaskData | string; 
}

export interface TaskInfo {
  id: number;
  name: string;
  type: string;
  skills: string[];
  points: number;
  duration: number;
  // TODO: Use enum
  complexity: string;
}

export interface TaskSectionViewModel {
  header: TaskSectionInfo;
  tasks: TaskViewModel[];
}

export interface TaskSectionInfo {
  id: number;
  name: string;
}

export interface MultichoiceTaskData {
  taskId?: number;
  question: string;
  answers: Answer[];
}

export interface Answer {
  id?: number;
  text: string;
  isCorrect: boolean;
}
