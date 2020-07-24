export enum TaskType {
    Multichoice,
    Coding
}
export enum TaskComplexity {
    Low,
    Medium,
    High
}
export interface TaskSummaryDto {
    id: number;
    name: string;
    type: TaskType;
    points: number;
    durationMinutes: number;
    skills: string[];
    complexity: TaskComplexity;
}
export interface TaskInfoDto {
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