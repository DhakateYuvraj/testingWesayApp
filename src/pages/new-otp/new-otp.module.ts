import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewOtp } from './new-otp';

@NgModule({
  declarations: [
    NewOtp,
  ],
  imports: [
    IonicPageModule.forChild(NewOtp),
  ],
})
export class NewOtpModule {}
