
import { MultichoiceTaskAnswerDto, MultichoiceTaskInfoDto, TaskSummaryDto, TaskDto, TaskType, TaskComplexity, SkillDto, SkillStateDto, SkillState } from './data-contract';
import { TaskSectionViewModel } from './interfaces';
import { TreeItem } from '../shared/utils/arrayToTree';
import { SkillDataService } from './services/data.service';

export class TaskViewModel {

    constructor(data: TaskDto) {
        this.header = new TaskInfo(data.taskSummary);


        if (data.taskSummary.type === TaskType.Multichoice) {
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
        //this.skills = data.skills;
        this.points = data.points;
        this.duration = data.durationMinutes;
        this.complexity = TaskComplexity[data.complexity];
        this.position = data.position;

        for(let s of data.skills){
            this.skills.push(SkillVm.fromDto(s))
        }
    }

    id: number;
    name: string;
    type: string;
    skills: SkillVm[] = [];
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

export class TaskCategoryVm implements TreeItem {
    id: number;
    name: string;
    position: number;
    children: TaskCategoryVm[];
}

export enum SkillStatus {
    Unchanged,
    New,
    Added,
    Removed
}
export class SkillVm {
    private constructor() {
    }

    static fromDto(skill: SkillDto, state?: SkillStatus): SkillVm {
        const res = new SkillVm();
        res.id = skill.id;
        res.name = skill.name;
        res.status = state ?? SkillStatus.Unchanged;
        return res;
    }

    static create(name: string, state: SkillStatus): SkillVm {
        const res = new SkillVm();
        res.name = name;
        res.status = state;
        return res;
    }

    id?: number;
    name: string;
    status: SkillStatus


    static getSkillState(skill: SkillVm): SkillStateDto {
        
        if (skill.status == SkillStatus.Unchanged){
            return null;
        }

        let res: SkillStateDto = {
            name: skill.name,
            id: skill.id,
            state: SkillState.Added
        };
        switch (skill.status) {
            case SkillStatus.Added:
                res.state = SkillState.Added;
                break;
            case SkillStatus.Removed:
                res.state = SkillState.Removed;
                break;
            case SkillStatus.New:
                res.state = SkillState.New;
                break;
            default:
                console.error(`Unexpected SkillStatus: ${skill.status}`)
                break;
        }
        return res;
    }
     
    
}


