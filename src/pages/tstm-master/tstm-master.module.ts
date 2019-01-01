import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TstmMasterPage } from './tstm-master';

@NgModule({
  declarations: [
    TstmMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(TstmMasterPage),
  ],
})
export class TstmMasterPageModule {}
