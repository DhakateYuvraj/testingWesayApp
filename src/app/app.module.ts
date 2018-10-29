import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home'; 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile'; 
import { LoginPage } from '../pages/login/login'; 
import { OtpPage } from '../pages/otp/otp';
import { FriendsListPage } from '../pages/friends-list/friends-list';
import { AuthService } from '../services/auth.service';
import { ConnectionService } from '../services/connection.service';
import { TraitService } from '../services/traits.service'; 
import { ListPage } from '../pages/list/list';
import { AddUserPage } from '../pages/add-user/add-user';
import { Contacts } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SettingsPage } from '../pages/settings/settings';
import { TraitDetailsPage } from '../pages/trait-details/trait-details';
import { BadgesListPage } from '../pages/badges-list/badges-list';
import { Facebook } from '@ionic-native/facebook';
import { ExpandableComponent } from '../components/expandable/expandable'

@NgModule({
	declarations: [
		MyApp,
		LoginPage, 
		HomePage, 
		ProfilePage, 
		FriendsListPage,
		TabsPage, 
		ListPage,
		AddUserPage,
		SettingsPage,
		ExpandableComponent
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot(),
		HttpModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		HomePage, 
		TabsPage,
		ProfilePage, 
		FriendsListPage, 
		ListPage,
		AddUserPage,
		SettingsPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AuthService, { provide: Http, useClass: ConnectionService },
		TraitService,
		Contacts,
		SocialSharing,
		Facebook
	]
})
export class AppModule {}
