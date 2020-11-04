
import { MultichoiceTaskAnswerDto, MultichoiceTaskInfoDto, TaskSummaryDto, TaskDto, TaskType, TaskComplexity, SkillDto, SkillStateDto, SkillState } from './data-contract';
import { TaskSectionViewModel as TaskSectionVm } from './interfaces';
import { TreeItem } from '../shared/utils/arrayToTree';
import { EditableLabelState } from '../shared/components/editable-label/editable-label.component';
import { SlicePipe } from '@angular/common';

export class TaskVm {

    section?: TaskSectionVm;
    header: TaskSummaryVm;
    content: MultichoiceTaskInfoVm | string;

    constructor(data: TaskDto) {
        this.header = TaskSummaryVm.fromDto(data.taskSummary);

        if (data.taskSummary.type === TaskType.Multichoice) {
            this.content = MultichoiceTaskInfoVm.fromDto(data.multichoiceTaskInfo);
            this.content.taskId = this.header.id;
        }
        // TODO:
        // else if (data.taskSummary.type === TaskType.Coding)
    }    
}

export class TaskSummaryVm {

    id: number;
    name: string;
    type: string;
    skills: SkillVm[] = [];
    points: number;
    duration: number;
    complexity: TaskComplexity;
    position?: number;
    state: EditableLabelState<string>;

    static fromDto(data: TaskSummaryDto) {

        const res = new TaskSummaryVm();

        res.id = data.id;
        res.name = data.name;
        res.type = TaskType[data.type];
        res.points = data.points;
        res.duration = data.durationMinutes;
        res.complexity = data.complexity;
        res.position = data.position;

        for (let s of data.skills) {
            res.skills.push(SkillVm.fromDto(s))
        }

        res.state = {
            editMode: data.id ? true : false,
            value: data.name
        };

        return res;
    }

    private constructor() {
    }
}

export class MultichoiceTaskAnswerVm {
    constructor() {
    }

    static fromDto(data: MultichoiceTaskAnswerDto): MultichoiceTaskAnswerVm {
        const res = new MultichoiceTaskAnswerVm();
        res.name = data.name;
        res.isCorrect = data.isCorrect;
        res.id = data.id;
        res.state = {
            editMode: data.id ? false : true,
            value: data.name
        };
        return res;
    }

    id?: number;
    name: string;
    isCorrect: boolean;
    state: EditableLabelState<string>;
}

export class MultichoiceTaskInfoVm {
    taskId?: number;
    question: string;
    answers: MultichoiceTaskAnswerVm[];

    static fromDto(data: MultichoiceTaskInfoDto): MultichoiceTaskInfoVm {
        let res = new MultichoiceTaskInfoVm();
        res.question = data.question;
        res.answers = data.answers.map(x => MultichoiceTaskAnswerVm.fromDto(x));
        return res;
    }
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
    id?: number;
    name: string;
    status: SkillStatus

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

    static getSkillState(skill: SkillVm): SkillStateDto {

        if (skill.status == SkillStatus.Unchanged) {
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

    clone() : SkillVm{
        const res = new SkillVm();
        res.id = this.id;
        res.name = this.name;
        res.status = this.status;
        return res;
    }

    private constructor() {
    }
}


