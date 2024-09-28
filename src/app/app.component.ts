import {Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidenavComponent} from "./core/layout/sidenav/sidenav.component";
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {NavbarComponent} from "./core/layout/navbar/navbar.component";
import {environment} from "../environments/environment.development";
import {AuthService} from "./core/auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet,
    SidenavComponent,
    MatSidenavContainer,
    NavbarComponent,
    MatSidenav
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authSvc = inject(AuthService);
  isExpanded = signal(true);
  isShowing = signal(false);
  sidenavBgImageUrl = `${environment.publicUrl}/images/sidebar-2.jpg`;

  mouseenter() {
    if (!this.isExpanded()) {
      this.isShowing.set(true);
    }
  }

  mouseleave() {
    if (!this.isExpanded()) {
      this.isShowing.set(false);
    }
  }

  toggleExpanded(emittedIsExpanded: boolean) {
    this.isExpanded.set(emittedIsExpanded);
  }
}
