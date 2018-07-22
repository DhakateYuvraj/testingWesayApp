import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from "@ionic/storage";

var rootApi = "http://ec2-18-219-80-120.us-east-2.compute.amazonaws.com:8080";

// import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  //   domain = environment.domain; // Production 

  authToken;
  options;

  constructor(
    private http: Http, private storage: Storage
  ) { }

  // Function to get token from client local storage
  saveToken(token) {
    localStorage.clear();
    localStorage.setItem('token', token);
    this.storage.set('token', token);
    // console.log(this.storage.get('token'), token);
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');

    // this.storage.get('token').then((token) => {
    //   this.authToken = token
    //   console.log(this.authToken,token);
    // }); 
  }


  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'X-Authorization': this.authToken // Attach token
        // 'X-Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0IiwiaWF0IjoxNTI1NzEyMjk0LCJzdWIiOiJkaGFrYXRlLnl1dnJhakBnbWFpbC5jb20iLCJpc3MiOiI5MTg5NTY5NTQxNTEifQ.EOq8qA3557hGcMPHmjrUGilzAVFCLw05GbSFsW3UcB0'
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
