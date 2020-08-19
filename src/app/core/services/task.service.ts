import { Injectable } from '@angular/core';
import { TaskDataService } from './data.service';
import { TaskViewModel, TaskInfo } from '../view-models';
import { Observable, throwError, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { switchMap, catchError, flatMap, map, share, publishLast, refCount, tap, switchMapTo, publish, startWith, mergeMap } from 'rxjs/operators';
import { CreateTaskCommand } from '../data-contract';
import { ActivatedRoute } from '@angular/router';

// Manages the tasks
// Load the tasks by category, applies the filter 
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // private _tasks: BehaviorSubject<TaskViewModel[]> = new BehaviorSubject([]);
  // public readonly tasks$: Observable<TaskViewModel[]> = this._tasks.asObservable();

  filterText$: Observable<string> = new Observable(null);

  private _categoryId: number;
  private _categoryTracker = new Subject();

  private _tasksTracker: Subject<TaskViewModel[]> = new Subject();
  private _tasks$: Observable<TaskViewModel[]>;
  private _tasksStore: TaskViewModel[] = [];

  constructor(
    private taskDataService: TaskDataService
  ) {

    // load data from server
    // this._categoryTracker.pipe(
    //   //tap((categoryId) => this._categoryId = categoryId),
    //   switchMap(() =>
    //     this.taskDataService.getTasksByCategory(this._categoryId).pipe(
    //       map(((x) => x.map((y => new TaskViewModel(y))))),
    //       tap(x => this._tasksStore = x),
    //       tap(x => this._tasksTracker.next(x)),
    //       //switchMap(x => { this._tasks.next(x); return this._tasks.asObservable() }),
    //       catchError((err) => { alert(err); return throwError(err); })
    //     )
    //   )
    // );

    this._categoryTracker.pipe(
      //tap((categoryId) => this._categoryId = categoryId),
      switchMap(() =>
        this.taskDataService.getTasksByCategory(this._categoryId).pipe(
          map(((x) => x.map((y => new TaskViewModel(y))))),
          tap(x => this._tasksStore = x),
          tap(x => this._tasksTracker.next(x)),          
          catchError((err) => { alert(err); return throwError(err); })
        )
      )
    );

    this._categoryTracker
      .subscribe(() => console.log(`categoryTracker: ${this._categoryId}`));

    const allTasks$ = this._tasksTracker.asObservable();
    this._tasks$ =allTasks$;
    // apply filter
    // this._tasks$ = combineLatest([allTasks$, this.filterText$]).pipe(
    //   map(([allTasks, filterText]) => filterText ? this.filterTasks(allTasks, filterText) : allTasks)
    // );

  }

  getTasks(categoryId: number): Observable<TaskViewModel[]> {
    this._categoryId = categoryId;
    this._categoryTracker.next();
    return this._tasks$;
  }

  createTask(cmd: CreateTaskCommand): Observable<TaskViewModel> {

    const res$ = this.taskDataService.createTask(cmd).pipe(
      map(x => new TaskViewModel(x)),
      tap(x => this._tasksStore.push(x)),
      tap(() => this._tasksTracker.next(Object.assign({}, this._tasksStore))),
      catchError((err) => { alert(err); return throwError(err); })
    );
    return res$;
    // res$.subscribe(res => {
    //   this._tasks.getValue().push(res);
    //   this._tasks.next(this._tasks.getValue());
    // });
  }

  updateTaskPosition(taskId: number, newPosition: number): Observable<TaskViewModel[]> {
    const res$ = this.taskDataService.updateTaskPosition(taskId, newPosition)
      .pipe(
        switchMap(() => this.reloadTasks()),
        catchError((err) => { alert(err); return throwError(err); })
      );
    return res$;
  }


  private reloadTasks(): Observable<TaskViewModel[]> {
    if (this._categoryId === undefined) {
      throw new Error('Service is not initialized! categoryId is undefined');
    }
    this._categoryTracker.next();
    return this._tasks$;
  }
  private filterTasks(tasks: TaskViewModel[], filterText: string): TaskViewModel[] {
    filterText = filterText.toLowerCase();
    const res = tasks.filter(x => x.header.name.toLowerCase().indexOf(filterText) === 0);
    return res;
  }

}
