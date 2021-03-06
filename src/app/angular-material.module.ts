import { NgModule } from '@angular/core';

import { MatInputModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatDialogModule } from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule {}
