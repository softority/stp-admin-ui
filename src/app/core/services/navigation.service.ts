import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private titleSource = new BehaviorSubject<string>("");
  currentTitle = this.titleSource.asObservable();
  constructor() { }

  changeTitle(title: string) {
    this.titleSource.next(title);
}
}
