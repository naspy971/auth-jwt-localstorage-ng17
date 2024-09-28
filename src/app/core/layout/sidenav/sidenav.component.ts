import {Component, inject, input, signal} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {environment} from "../../../../environments/environment.development";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatNavList,
    MatListItem,
    MatIcon,
    NgClass,
    RouterLink,
    TranslateModule,
    RouterLinkActive
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  protected readonly appTitle = environment.appTitle;
  protected readonly authSvc = inject(AuthService);
  isExpanded = input.required<boolean>();
  isShowing = input.required<boolean>();
  showSubmenu = signal(false);

  protected isExpandedOrShowing(): boolean {
    return this.isExpanded() || this.isShowing();
  }

  protected toggleSubmenu(): void {
    this.showSubmenu.set(!this.showSubmenu());
  }
}
