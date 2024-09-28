import {Component, inject, input, output} from '@angular/core';
import {LanguageSelectComponent} from "./components/language-select/language-select.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "../../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationModalComponent} from "../../../shared";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LanguageSelectComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatToolbar,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  protected readonly authSvc = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  isExpanded = input.required<boolean>();
  toggleExpanded = output<boolean>();

  onToggleExpanded() {
    this.toggleExpanded.emit(!this.isExpanded());
  }

  onLogout() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to log out?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authSvc.logout();
      }
    });
  }
}
