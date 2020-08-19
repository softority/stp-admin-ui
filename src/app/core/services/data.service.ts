import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tasks } from '../example-data';
import { TaskViewModel, Answer, MultichoiceTaskData } from '../view-models';
import { delay, tap, map, switchMap, flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TaskDto, TaskCategoryDto, CreateCategoryCommand, CreateTaskCommand, SkillDto } from '../data-contract';

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


  updateTaskPosition(taskId: number, position: number) {
    const res$ = this.http.put<TaskCategoryDto>(
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
