import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'top/:uid/:sid',
    loadChildren: () => import('./top/top.module').then(m => m.TopPageModule)
  },
  {
    path: 'user-profile/:uid',
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfilePageModule)
  },
  {
    path: 'edit-top/:sid',
    loadChildren: () => import('./edit-top/edit-top.module').then(m => m.EditTopPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
