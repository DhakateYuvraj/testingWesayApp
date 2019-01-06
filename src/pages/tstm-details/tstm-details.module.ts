import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TstmDetailsPage } from './tstm-details';

@NgModule({
  declarations: [
    TstmDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TstmDetailsPage),
  ],
})
export class TstmDetailsPageModule {}
