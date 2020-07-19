import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tasks } from '../example-data';
import { TaskViewModel, Answer, MultichoiceTaskData } from '../interfaces';
import { delay } from 'rxjs/operators';

export interface Result<T>{
  ok: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { 
  }

  getTasks(): Observable<TaskViewModel[]>{
    // const result$ = new  Observable<TaskViewModel[]>(observer => {
    //   setTimeout(() => {observer.next(tasks)}, 1500)
    // });
    const res$ = of(tasks).pipe(delay(1500));
    return  res$;
  }

  addAnswer(taskId: number, answer: Answer): Observable<Result<Answer>>{
    const task = tasks.find(x => x.header.id === taskId);
    let res$ = null;
    if (task){
      const newId = Math.ceil(Math.random() * 99999);
      answer.id = newId;
      (task.content as MultichoiceTaskData).answers.push(answer);
      res$ = of({ok: true, data:answer}).pipe(delay(5000));
    }
    else{
      res$ = of({ok: false, message:'Task with Id='+taskId+' not found'}).pipe(delay(1000));
    }
    
    return  res$;
  }
}
