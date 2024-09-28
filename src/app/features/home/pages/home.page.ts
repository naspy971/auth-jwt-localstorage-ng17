import {Component, inject} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home.page.html',
  imports: [
    TranslateModule,
    AsyncPipe
  ],
  styleUrl: './home.page.scss'
})
export class HomePage{
  protected readonly authSvc = inject(AuthService);
}
