import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: '', component: AppComponent,
    
  },
  { path: 'a', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'sbx', loadChildren: () => import('./sbx/sbx.module').then(m => m.SbxModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
