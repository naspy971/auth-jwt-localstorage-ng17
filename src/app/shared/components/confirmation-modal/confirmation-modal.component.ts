import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    TranslateModule,
    MatDialogTitle,
    MatIconButton,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent implements OnInit {
  public message!: string;
  public header!: string;

  constructor(
    private translateSvc: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: { message: string; header: string }
  ) {}

  public ngOnInit(): void {
    this.header = this.data?.header || this.translateSvc.instant('modal.logoutConfirm');
    this.message = this.data?.message;
  }
}
