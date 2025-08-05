import { Routes } from '@angular/router';
import {LiveComponent} from "./live/live.component";
import {DemoComponent} from "./demo/demo.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'live'
  },
  {
    path: 'live',
    component: LiveComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  }
];
