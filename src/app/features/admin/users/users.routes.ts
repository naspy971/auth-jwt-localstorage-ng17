import {Routes} from "@angular/router";
import {UserDetailPage} from "./user-detail/pages/user-detail.page";
import {UserListPage} from "./user-list/pages/user-list.page";

export const usersRoutes: Routes = [
  {path: 'list', component: UserListPage},
  {path: ':id', component: UserDetailPage}
];
