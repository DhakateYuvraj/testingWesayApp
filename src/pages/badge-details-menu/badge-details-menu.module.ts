import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BadgeDetailsMenuPage } from './badge-details-menu';

@NgModule({
  declarations: [
    BadgeDetailsMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(BadgeDetailsMenuPage),
  ],
})
export class BadgeDetailsMenuPageModule {}
