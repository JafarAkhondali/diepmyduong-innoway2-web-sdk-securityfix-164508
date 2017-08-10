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
                    if(response.code === 200){
                        resolve(response);
                    }else{
                        reject(response)
                    }
                }).fail((request:any,err:any,status:any) => {
                    reject(request.responseJSON);
                });
            }catch(err){
                reject(err);
            }       
        })
    }

    public static Url(node:string,query = {},params={}){
        return URL.apiUrl('api/'+Config.get('version')+'/'+node,query,params);
    }

    public static setAccessToken(token:string){
        sessionStorage.setItem('innoway2.api.token',token);
    }

    public static getAccessToken(){
        return sessionStorage.getItem('innoway2.api.token');
    }
}