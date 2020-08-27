import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tasks } from '../example-data';
import { TaskViewModel, Answer, MultichoiceTaskData } from '../view-models';
import { delay, tap, map, switchMap, flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TaskDto, TaskCategoryDto, CreateCategoryCommand, CreateTaskCommand, SkillDto, SkillStateDto, TaskComplexity, MultichoiceTaskAnswerDto, AddTaskAnswerCommand } from '../data-contract';

export interface Result<T> {
  ok: boolean;
  message?: string;
  data?: T;
}

const baseUrl = "https://localhost:5001";


@Injectable({
  providedIn: 'root'
})
export class SkillDataService {

  constructor(private http: HttpClient) {
  }

  getAllSkills(): Observable<SkillDto[]> {
    console.log('getAllSkills -->');
    const res$ = this.http
      .get<SkillDto[]>(`${baseUrl}/api/Skill/GetAllSkills`);
    return res$;
  }

  createSkill(name: string): Observable<SkillDto> {
    const res$ = this.http.post<SkillDto>(`${baseUrl}/api/Skill/CreateSkill`, name);
    return res$;
  }

  deleteSkill(skillId: number) {
    const res$ = this.http.delete(`${baseUrl}/api/Skill/DeleteSkill/${skillId}`);
    return res$;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskCategoryDataService {

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<TaskCategoryDto[]> {
    const res$ = this.http
      .get<TaskCategoryDto[]>(`${baseUrl}/api/TaskCategory/GetCategories`);
    return res$;
  }

  createCategory(cmd: CreateCategoryCommand): Observable<TaskCategoryDto> {
    const res$ = this.http.post<TaskCategoryDto>(`${baseUrl}/api/TaskCategory/CreateCategory`, cmd);
    return res$;
  }

  updateCategoryName(categoryId: number, value: string) {
    const res$ = this.http.put<TaskCategoryDto>(
      `${baseUrl}/api/TaskCategory/UpdateCategoryName/${categoryId}`,
      JSON.stringify(value),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res$;
  }

  deleteCategory(categoryId: number) {
    const res$ = this.http.delete(
      `${baseUrl}/api/TaskCategory/DeleteCategory/${categoryId}`);
    return res$;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MultichoiceTaskAnswerDataService {

  constructor(private http: HttpClient) {
  }

  addTaskAnswer(cmd: AddTaskAnswerCommand): Observable<MultichoiceTaskAnswerDto> {
    console.log(`addTaskAnswer. taskId:${cmd.taskId}, name:${cmd.name} -->`);
    const res$ = this.http.post<MultichoiceTaskAnswerDto>(`${baseUrl}/api/MultichoiceTaskAnswer/AddTaskAnswer`, cmd);
    return res$;
  }

  updateTaskAnswer(answer: MultichoiceTaskAnswerDto) {
    console.log(`updateTaskAnswer. id:${answer.id}, name:${answer.name} -->`);
    const res$ = this.http.put(`${baseUrl}/api/MultichoiceTaskAnswer/UpdateTaskAnswer`, answer);
    return res$;
  }

  deleteTaskAnswer(answerId: number) {
    console.log(`deleteTaskAnswer. id:${answerId} -->`);
    const res$ = this.http.delete(`${baseUrl}/api/MultichoiceTaskAnswer/DeleteTaskAnswer/${answerId}`);
    return res$;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  constructor(private http: HttpClient) {
  }

  getTasksByCategory(taskCategoryId: number): Observable<TaskDto[]> {
    const res$ = this.http
      .get<TaskDto[]>(`${baseUrl}/api/Task/GetTasksByCategory/${taskCategoryId}`);

    return res$;
  }

  createTask(cmd: CreateTaskCommand): Observable<TaskDto> {
    const res$ = this.http.post<TaskDto>(`${baseUrl}/api/Task/CreateTask`, cmd);
    return res$;
  }

  updateTaskPoints(taskId: number, points: number) {
    console.log(`updateTaskPoints. taskId:${taskId}, points:${points} -->`);
    const res$ = this.http.put(`${baseUrl}/api/Task/UpdateTaskPoints/${taskId}`, JSON.stringify(points));
    return res$;
  }
  updateTaskComplexity(taskId: number, complexity: TaskComplexity) {
    console.log(`updateTaskComplexity. taskId:${taskId}, complexity:${complexity} -->`);
    const res$ = this.http.put(`${baseUrl}/api/Task/UpdateTaskComplexity/${taskId}`, JSON.stringify(complexity));
    return res$;
  }
  updateTaskDuration(taskId: number, duration: number) {
    console.log(`updateTaskDUration. taskId:${taskId}, duration:${duration} -->`);
    const res$ = this.http.put(`${baseUrl}/api/Task/UpdateTaskDuration/${taskId}`, JSON.stringify(duration));
    return res$;
  }

  updateTaskName(taskId: number, name: string) {
    console.log(`updateTaskName. taskId:${taskId}, name:${name} -->`);
    const res$ = this.http.put(
      `${baseUrl}/api/Task/UpdateTaskName/${taskId}`, 
      JSON.stringify(name),
      {
        headers: { 'Content-Type': 'application/json' }
      });
    return res$;
  }

  updateSkills(taskId: number, skills: SkillStateDto[]): Observable<SkillDto[]> {
    console.log(`updateSkills. taskId:${taskId} -->`);
    const res$ = this.http.put<SkillDto[]>(`${baseUrl}/api/Task/UpdateSkills/${taskId}`, skills);
    return res$;
  }

  updateTaskPosition(taskId: number, position: number) {
    const res$ = this.http.put(
      `${baseUrl}/api/TaskCategory/UpdateTaskPosition/${taskId}`,
      JSON.stringify(position),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res$;
  }

}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  getTasks(): Observable<TaskViewModel[]> {
    // const result$ = new  Observable<TaskViewModel[]>(observer => {
    //   setTimeout(() => {observer.next(tasks)}, 1500)
    // });
    const res$ = of(tasks).pipe(delay(1000));
    return res$;
  }

  addAnswer(taskId: number, answer: Answer): Observable<Result<Answer>> {
    const task = tasks.find(x => x.header.id === taskId);
    let res$ = null;
    if (task) {
      // const newId = Math.ceil(Math.random() * 99999);
      // answer.id = newId;
      //(task.content as MultichoiceTaskData).answers.push(answer);
      res$ = of({ ok: true, data: answer }).pipe(
        delay(2000),
        tap(x => x.data.id = Math.ceil(Math.random() * 99999))
      )
        ;
    }
    else {
      res$ = of({ ok: false, message: 'Task with Id=' + taskId + ' not found' }).pipe(delay(1000));
    }

    return res$;
  }
}
