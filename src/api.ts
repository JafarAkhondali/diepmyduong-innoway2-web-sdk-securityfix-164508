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
}