import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TraitsListPage } from './traits-list';

@NgModule({
  declarations: [
    TraitsListPage,
  ],
  imports: [
    IonicPageModule.forChild(TraitsListPage),
  ],
})
export class TraitsListPageModule {}
