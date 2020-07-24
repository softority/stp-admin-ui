
import { MultichoiceTaskAnswerDto, MultichoiceTaskInfoDto, TaskSummaryDto, TaskInfoDto, TaskType, TaskComplexity } from './data-contract';
import { TaskSectionViewModel } from './interfaces';

export class TaskViewModel {

    constructor(data: TaskInfoDto) {
        this.header = new TaskInfo(data.taskSummary);

        if (data.taskSummary.type === TaskType.Multichoice){
            this.content = new MultichoiceTaskData(data.multichoiceTaskInfo);
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
    }

    id: number;
    name: string;
    type: string;
    skills: string[];
    points: number;
    duration: number;
    // TODO: Use enum
    complexity: string;
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


