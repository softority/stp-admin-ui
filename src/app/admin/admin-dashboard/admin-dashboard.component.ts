import { Component, OnInit } from '@angular/core';
import { NavCardItem } from 'src/app/shared/components/nav-card/nav-card.component';

@Component({
  selector: 'stp-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor() { }

  navItems: NavCardItem[] = [
    { caption: "Home", iconName: "home", url: "/a" },
    { caption: "Tasks", iconName: "category", url: "/a/tasks" },
    { caption: "Tests", iconName: "spellcheck", url: "/a/tests" },
    // { caption: "Home", iconName: "home", url: "" },
    // { caption: "Categories", iconName: "category", url: "categories" },
    // { caption: "Tests", iconName: "spellcheck", url: "tests" },
    // { caption: "Home", iconName: "home", url: "" },
    // { caption: "Categories", iconName: "category", url: "categories" },
    // { caption: "Home", iconName: "home", url: "" },
    // { caption: "Categories", iconName: "category", url: "categories" },
    // { caption: "Tests", iconName: "spellcheck", url: "tests" },
    // { caption: "Home", iconName: "home", url: "" },
    // { caption: "Categories", iconName: "category", url: "categories" },
    // { caption: "Tests", iconName: "spellcheck", url: "tests" },
    // { caption: "Home", iconName: "home", url: "" },
    // { caption: "Categories", iconName: "category", url: "categories" },
  ];

  ngOnInit(): void {
  }

}
