'use strict';
import { Config } from './config';
import { URL } from './utils/helper';
import Module from './modules/index';
declare var $:any;

export class Api {
 
    public static module(name:string){
        return Module(name);
    }

    public static exec(settings:any){
        return new Promise((resolve:any,reject:any)=>{
            try { 
                $.ajax(settings).done((response:any) => {
                    resolve(response);
                }).fail((request:any,err:any,status:any) => {
                    reject(err,status);
                });
            }catch(err){
                reject(err);
            }       
        })
    }

    public static setAccessToken(token:string){
        sessionStorage.setItem('chatgut.api.token',token);
    }

    public static getAccessToken(){
        return sessionStorage.getItem('chatgut.api.token');
    }

    public static smsVerify(data:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": URL.apiUrl("api/smsVerify"),
            "method": "POST",
            "headers": {
                "access_token": Api.getAccessToken(),
                "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        return Api.exec(settings);
    }

    public static refeshToken(){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": URL.apiUrl("api/refeshToken",{access_token:Api.getAccessToken()}),
            "method": "GET"
        }
        return Api.exec(settings);
    }

    public static getTokenInfo(){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": URL.apiUrl("api/info",{access_token:Api.getAccessToken()}),
            "method": "GET"
        }
        return Api.exec(settings);
    }

    public static storeSubscriberToken(token:string){
        localStorage.setItem('chatgut.api.subscirber-token',token);
    }

    public static getSubscriberToken(){
        return localStorage.getItem('chatgut.api.subscirber-token');
    }
}