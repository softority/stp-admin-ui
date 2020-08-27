import { SkillVm } from './view-models';

// #region TaskCategory

export class TaskCategoryDto {
    id: number;
    name: string;
    parentId?: number;
    position: number;
}

export class CreateCategoryCommand {
    parentCategoryId?: number;
    name: string;
}

//#endregion

// #region Task

export interface CreateTaskCommand{
    taskCategoryId: number;

    name: string;
    points: number;
    durationMinutes: number;
    complexity: TaskComplexity;
    type: TaskType;
    skills: SkillStateDto[];
    
}
export interface SkillStateDto{
    id?: number;
    name: string;
    state: SkillState;
}
export enum SkillState {
    Added = 0,
    Removed = 1,
    New = 2,
}
export enum TaskType {
    Multichoice = 0,
    Coding = 1
}
export enum TaskComplexity {
    Low = 0,
    Medium = 1,
    High = 2
}
export interface TaskSummaryDto {
    id: number;
    name: string;
    type: TaskType;
    points: number;
    durationMinutes: number;
    skills: SkillDto[];
    complexity: TaskComplexity;
    position?: number;
}
export interface TaskDto {
    taskSummary: TaskSummaryDto;
    multichoiceTaskInfo: MultichoiceTaskInfoDto;
    codingTaskInfo: CodingTaskInfoDto;
}
export interface MultichoiceTaskInfoDto {
    question: string;
    answers: MultichoiceTaskAnswerDto[];
}
export interface CodingTaskInfoDto {
    question: string;
    codingToolUrl: string;
}
export interface MultichoiceTaskAnswerDto {
    id: number;
    name: string;
    isCorrect: boolean;
}

export interface AddTaskAnswerCommand{
    taskId: number;
    name: string;
    isCorrect: boolean;
}

//#endregion

export interface SkillDto{
    id: number;
    name: string;
}
