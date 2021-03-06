import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from "@ionic/storage";

var rootApi = "http://ec2-18-219-80-120.us-east-2.compute.amazonaws.com:8080";

@Injectable()
export class AuthService {
	public authToken;
	public options;
	public loading;

	constructor(
		private http: Http, 
		private storage: Storage
	) { 
	
	
	}
  
	saveToken(token) {
		localStorage.clear();
		localStorage.setItem('token', token);
		this.storage.set('token', token);
	}

	loadToken() {
		this.authToken = localStorage.getItem('token');
	}

	createAuthenticationHeaders() {
		this.loadToken();
		this.options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json', // Format set to JSON
				'X-Authorization': this.authToken // Attach token
			})
		});
	}

  // Function to register user accounts
	registerUser(user) {
		return this.http.post(rootApi + '/api/emailregistration/', user, this.options).map(res => res.json());
	}

	valuateOtp(userOtp) {
		this.createAuthenticationHeaders();
		return this.http.post(rootApi + '/api/validateotpviaemail/', userOtp, this.options).map(res => res.json());
	}

	resendOTP(useremailid) {
	this.createAuthenticationHeaders();
		return this.http.post(rootApi + '/api/resendactivationcode/', useremailid, this.options).map(res => res.json());
	}

	// Function to login user
	loginUser(user) {
		return this.http.post(rootApi + '/api/loginviaemail/', user, this.options).map(res => res.json());
	}

	addUser(user) {
		this.createAuthenticationHeaders();
		return this.http.post(rootApi + '/userzone/addContacts/', user, this.options).map(res => res.json());
	}

	sendFrdReq(friendsid, token) {
		this.authToken = token;
		this.createAuthenticationHeaders();
		return this.http.post(rootApi + '/userzone/sendfriendrequest/', friendsid, this.options).map(res => res.json());
	}

	acceptInviation(friendsid, token) {
		this.authToken = token;
		this.createAuthenticationHeaders();
		return this.http.post(rootApi + '/userzone/acceptfriendrequest/', friendsid, this.options).map(res => res.json());
	}
	// Function to logout
	logout() {
		this.storage.remove('token');
		this.storage.clear();
		localStorage.clear();
	}

}
