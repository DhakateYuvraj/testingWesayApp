import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from "@ionic/storage";
import { LoadingController, ModalController, ToastController } from 'ionic-angular';
import moment from 'moment';
import jQuery from "jquery";

var rootApi = "http://ec2-18-219-80-120.us-east-2.compute.amazonaws.com:8080";

@Injectable()
export class TraitService {
	public authToken;
	public options;
	public loading;
	public anonymousMode;
	public scrollHt: number = 0;
	public topOrBottom;
	public contentBox;
	public tabBarHeight;
	public togglePanelObj={
		rating : false,
		comments : false,
		voting : false
	};
	
	constructor(
	private http: Http, 
	private storage: Storage,
	public modalCtrl: ModalController,
	private loadingCtrl: LoadingController, 
	private toastCtrl: ToastController
	){ 
		this.presentLoadingDefault();
	}

	presentLoadingDefault() {
		this.loading = this.loadingCtrl.create({ spinner: 'bubbles' });
	}

	showLoading(){
		this.presentLoadingDefault();
		//if(!this.loading){
			this.presentLoadingDefault();
			this.loading.present();
		//}
	}
	hideLoading(){
		if(this.loading){
			this.loading.dismiss();
		}
	}
	
	presentSuccessToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 2000,
			position: 'top'
		});
		toast.present(); 
	}
	toggleMenu() {
		let addModal = this.modalCtrl.create('MenuPage');
		addModal.onDidDismiss(() => {
			return false;
		});
		addModal.present();
	}
	
	// Function to get token from client local storage
	loadToken() {
		this.authToken = localStorage.getItem('token');
		this.storage.get('token').then((token) => {
			this.authToken = token;
			console.log(this.authToken);
			return token
		});
	}


	createAuthenticationHeaders(token) {
		this.options = new RequestOptions({
			headers: new Headers({
				"Content-Type": "application/json",
				"X-Authorization": token
			})
		});
	}

	calcuateTime(ipDate){
		return(moment(moment.utc(ipDate).local().format()).fromNow())
	}
	formatTime(ipDate){
		return(moment(moment.utc(ipDate).local().format()))
	}
	
	
	/* --------------- toggle card, collapsible --------------- */
	changeVisibilityMode(){
		this.anonymousMode = !this.anonymousMode;
		if(this.anonymousMode){
			this.presentSuccessToast('Anonymous Mode');
		}else{
			this.presentSuccessToast('Public Mode');
		}
	}	
	isAnonymousMode(){
		return this.anonymousMode;
	}
	/* --------------- toggle card, collapsible end --------------- */
	/* ---------------  ---------------  ---------------  ---------------  ---------------  ---------------  ---------------  --------------- */
	
	
	/* --------------- toggle card, collapsible --------------- */
	togglePanel(paneName) {
		this.togglePanelObj[paneName] = !this.togglePanelObj[paneName];
	};
	isPanelShow(paneName) {
		return this.togglePanelObj[paneName];
	}; 
	showPanel(paneName,visibility) {
		this.togglePanelObj[paneName] = visibility;
	};
	/* --------------- toggle card, collapsible end --------------- */
	/* ---------------  ---------------  ---------------  ---------------  ---------------  ---------------  ---------------  --------------- */
	
	
	
	scrollingFun(e) {
		if (e.scrollTop > this.scrollHt) {
			jQuery(".tabbar").css("display", "none");
			jQuery(".scroll-content").css("margin-bottom", "0");
			if (this.topOrBottom == "top") {
				this.contentBox.marginTop = 0;
			} else if (this.topOrBottom == "bottom") {
				this.contentBox.marginBottom = 0;
			}
		} else {
			jQuery(".tabbar").css("display", "flex");
			jQuery(".scroll-content").css("margin-bottom", "56px");
			if (this.topOrBottom == "top") {
				this.contentBox.marginTop = this.tabBarHeight;
			} else if (this.topOrBottom == "bottom") {
				this.contentBox.marginBottom = this.tabBarHeight;
			}
		}
		this.scrollHt = e.scrollTop;
	}
	
	
	
  // Function to get list of all traits
	getAllTrais(token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/getActiveTraits/', null, this.options).map(res => res.json());
	}

	getListOfPopularTraits(token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/getListOfPopularTraits/', {}, this.options).map(res => res.json());
	}

	addTraitToPage(traits, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/addTrait/', traits, this.options).map(res => res.json());
	}
	
	getLoginUserTraits(token, profile) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userTraits/getMyTraits/', profile, this.options).map(res => res.json());
	}

	/* deleteTrait(trait, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/deleteTrait/', trait, this.options).map(res => res.json());
	} */

	getMyFriendList(token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/friendsZone/', null, this.options).map(res => res.json());
	}

	getSettings(token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/mysettings/', null, this.options).map(res => res.json());
	}

	addContacts(list, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/uploadContact/', list, this.options).map(res => res.json());
	}

	getTraitDetails(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userTraits/details', traitdata, this.options).map(res => res.json());
	}

	hideTrait(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/hideUnhideTraitForUser/', traitdata, this.options).map(res => res.json());
	}

	hideTraitCount(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/traits/hideUnhideCount/', traitdata, this.options).map(res => res.json());
	}

	deleteTrait(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/deleteUserTrait/', traitdata, this.options).map(res => res.json());
	}
	
	customPoints(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/traits/ratings', traitdata, this.options).map(res => res.json());
	}
	
	commentList(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/traits/comment/list', traitdata, this.options).map(res => res.json());
	}
	
	commentLikeDislike(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/traits/comment/like', traitdata, this.options).map(res => res.json());
	}
	
	commentAdd(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/traits/comment', traitdata, this.options).map(res => res.json());
	}
	
	giveVote(traitdata, token){
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/traits/vote/submit', traitdata, this.options).map(res => res.json());
	}
	
	rejectUserTrait(traitdata, token){
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/rejectUserTrait/', traitdata, this.options).map(res => res.json());
	}
	
	acceptUserTrait(traitdata, token){
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/acceptUserTrait/', traitdata, this.options).map(res => res.json());
	}
	
	getUserProfile(userdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/api/user/details/', userdata, this.options).map(res => res.json());
	}
	
	getBadgesMasterList(token) {
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/getBadgeGallery/', this.options).map(res => res.json());
	}
	
	getAvailableBadgesCnt(token) {
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/availableBadgeCount/', this.options).map(res => res.json());
	}
	
	getAvailableBadges(token) {
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/availableBadges/', this.options).map(res => res.json());
	}
	
	getReceivedBadges(token,userId) {
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/receivedBadges/?userid='+userId, this.options).map(res => res.json());
	}
	
	getGivenBadges(token) {
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/givenBadges/', this.options).map(res => res.json());
	}
	
	getGivenBadgesCnt(token) {
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/givenBadgeCount/', this.options).map(res => res.json());
	}
	
	giveBadgeToFriend(token,badgeInfo){
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/badge/giveBadge/', badgeInfo, this.options).map(res => res.json());
	}
	
	getBadgeDetails(token,badgeInfo){
		this.createAuthenticationHeaders(token);
		return this.http.get(rootApi + '/badge/badgeDetail/?userId='+badgeInfo.userId+'&badgeId='+badgeInfo.badgeId, this.options).map(res => res.json());	
	}
	
	deleteBadge(token,badgeInfo){
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/badge/deleteBadge/', badgeInfo, this.options).map(res => res.json());		
	}
	
	hideUnhideBadge(token,badgeInfo){
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/badge/hideBadge/', badgeInfo, this.options).map(res => res.json());		
	}
	
	
	
	
  
}
