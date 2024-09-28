import {Component, inject} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-language-select',
  standalone: true,
  imports: [
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    MatButton,
    MatMenuItem,
    UpperCasePipe
  ],
  templateUrl: './language-select.component.html',
  styleUrl: './language-select.component.scss'
})
export class LanguageSelectComponent{
  protected readonly translateSvc = inject(TranslateService);

  onChangeLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translateSvc.use(lang);
  }
}
