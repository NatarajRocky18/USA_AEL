import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './component/app-layout/default-layout/default-layout.component';
import { InitialLayoutComponent } from './component/app-layout/initial-layout/initial-layout.component';

const routes: Routes = [
  {
    path: '',
    component: InitialLayoutComponent
  },
  {
    path: 'questions',
    component: DefaultLayoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
