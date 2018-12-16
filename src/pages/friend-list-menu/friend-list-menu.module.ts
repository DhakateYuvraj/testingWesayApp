import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendListMenuPage } from './friend-list-menu';

@NgModule({
  declarations: [
    FriendListMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendListMenuPage),
  ],
})
export class FriendListMenuPageModule {}
