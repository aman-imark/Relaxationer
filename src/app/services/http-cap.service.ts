import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, HttpResponse, HttpOptions } from '@capacitor-community/http';




@Injectable({
  providedIn: 'root'
})
export class HttpCapService {


  public yourSiteUrl =  'https://relaxationer.com';
  public Baseurl: string = this.yourSiteUrl + '/api';

  constructor(private platform: Platform, private http: HttpClient) { }


  postData(Url, payload, token = '') {

    let nativeHeaders;

    if(token === '') {
        nativeHeaders = {
           'Content-Type': 'application/json', 
           'Access-Control-Allow-Origin': '*', 
        };
    }else {
        nativeHeaders = {
           'Content-Type': 'application/json', 
           'Access-Control-Allow-Origin': '*',
           'Authorization': `Bearer ${token}`
        };
    }


      return new Promise(resolve => {

          if(this.platform.is('ios') || this.platform.is('android')) {
            Http.request({url: this.Baseurl+Url,  method: 'POST', data: payload, 
                          headers: nativeHeaders }).then(data => {
                // console.log(data.data);
                resolve(data.data);              
            }, (er) => {
                console.log(er);
                resolve(er);
            }).catch(err => {
                console.log(err);
                resolve(err);
            });
            
          } else {
            Http.request({url: this.Baseurl+Url,  method: 'POST', data: payload, 
                          headers: nativeHeaders }).then(data => {
                resolve(data.data);
            }, (er) => {
                 console.log(er);
                 resolve(er);
            }).catch(err => {
                console.log(err);
                resolve(err);
            });
          }
      });
  }



  postFormData(Url,payload, token = '') {
    // CROS isssue comes when we using 'Content-Type': 'application/json' or 'enctype': 'multipart/form-data' 

    let nativeHeaders;

    if(token === '') {
        nativeHeaders = {
           'Content-Type': 'multipart/form-data', 
           'Access-Control-Allow-Origin': '*', 
        };
    }else {
        nativeHeaders = {
           'Content-Type': 'multipart/form-data', 
           'Access-Control-Allow-Origin': '*',
           'Authorization': `Bearer ${token}`
        };
    }

      return new Promise(resolve => {

          if(this.platform.is('ios') || this.platform.is('android')) {
            Http.request({url: this.Baseurl+Url,  method: 'POST', data: payload, 
                          headers: nativeHeaders }).then(data => {
                // console.log(data.data);
                resolve(data.data);              
            }, (er) => {
                console.log(er);
                resolve(er);
            }).catch(err => {
                console.log(err);
                resolve(err);
            });
            
          } else {
            Http.request({url: this.Baseurl+Url,  method: 'POST', data: payload, 
                          headers: nativeHeaders }).then(data => {
                resolve(data.data);
            }, (er) => {
                 console.log(er);
                 resolve(er);
            }).catch(err => {
                console.log(err);
                resolve(err);
            });
          }
      });
  }



  

  getData(Url,token = '') {
    
    let nativeHeaders;

    if(token === '') {
        nativeHeaders = {
           'Content-Type': 'multipart/form-data', 
           'Access-Control-Allow-Origin': '*', 
        };
    }else {
        nativeHeaders = {
           'Content-Type': 'multipart/form-data', 
           'Access-Control-Allow-Origin': '*',
           'Authorization': `Bearer ${token}`
        };
    }

    return new Promise(resolve => { 
      Http.request({url: this.Baseurl+Url,  method: 'GET', headers: nativeHeaders }).then(data => {
          // console.log(data);
          // const d = JSON.parse(data.data);
          resolve(data.data);

      }).catch(error => {
          console.log(error);
          // const er = JSON.parse(error.error);
          resolve(error);
      });
    })
  }





}
