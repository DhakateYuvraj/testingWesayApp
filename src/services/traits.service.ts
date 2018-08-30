import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from "@ionic/storage";

var rootApi = "http://ec2-18-219-80-120.us-east-2.compute.amazonaws.com:8080";

@Injectable()
export class TraitService {
  authToken;
  options;

  constructor(
    private http: Http, private storage: Storage
  ) { }

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


  // Function to get list of all traits
	getAllTrais(token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/getActiveTraits/', null, this.options).map(res => res.json());
	}

	getListOfPopularTraits(token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/getListOfPoulerTraits/', {}, this.options).map(res => res.json());
	}

	addTraitToPage(traits, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/addTrait/', traits, this.options).map(res => res.json());
	}

	getLoginUserTraits(token, profile) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userTraits/getMyTraits/', profile, this.options).map(res => res.json());
	}

	deleteTrait(trait, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/traitapi/deleteTrait/', trait, this.options).map(res => res.json());
	}

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
		return this.http.post(rootApi + '/userzone/getTraitDetails/', traitdata, this.options).map(res => res.json());
	}

	hideTrait(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/hideTrait/', traitdata, this.options).map(res => res.json());
	}

	hideTraitCount(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/hideTraitCount/', traitdata, this.options).map(res => res.json());
	}
	
	customPoints(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/customPoints/', traitdata, this.options).map(res => res.json());
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
	
	commentReply(traitdata, token) {
		this.createAuthenticationHeaders(token);
		return this.http.post(rootApi + '/userzone/traits/commentReply', traitdata, this.options).map(res => res.json());
	}
  
}
