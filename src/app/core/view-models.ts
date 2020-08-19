
import { MultichoiceTaskAnswerDto, MultichoiceTaskInfoDto, TaskSummaryDto, TaskDto, TaskType, TaskComplexity } from './data-contract';
import { TaskSectionViewModel } from './interfaces';
import { TreeItem } from '../shared/utils/arrayToTree';

export class TaskViewModel {

    constructor(data: TaskDto) {
        this.header = new TaskInfo(data.taskSummary);

        
        if (data.taskSummary.type === TaskType.Multichoice){            
            this.content = new MultichoiceTaskData(data.multichoiceTaskInfo);
            this.content.taskId = this.header.id;
        }
        // TOOD:
        // else if (data.taskSummary.type === TaskType.Coding)
    }

    section?: TaskSectionViewModel;
    header: TaskInfo;
    content: MultichoiceTaskData | string;
}

export class TaskInfo {

    constructor(data: TaskSummaryDto) {
        this.id = data.id;
        this.name = data.name;
        this.type = TaskType[data.type];
        this.skills = data.skills;
        this.points = data.points;
        this.duration = data.durationMinutes;
        this.complexity = TaskComplexity[data.complexity];
        this.position = data.position;
    }

    id: number;
    name: string;
    type: string;
    skills: string[];
    points: number;
    duration: number;
    // TODO: Use enum
    complexity: string;

    position?: number;
}

export class Answer {
    constructor(data: MultichoiceTaskAnswerDto) {
        this.text = data.name;
        this.isCorrect = data.isCorrect;
        this.id = data.id;
    }
    id?: number;
    text: string;
    isCorrect: boolean;
}

export class MultichoiceTaskData {

    constructor(data: MultichoiceTaskInfoDto) {
        this.question = data.question;
        this.answers = data.answers.map(x => new Answer(x));
    }
    taskId?: number;
    question: string;
    answers: Answer[];
}

export class TaskCategoryVm implements TreeItem{
    id: number;
    name: string;    
    position: number;   
    children:  TaskCategoryVm[];
}


