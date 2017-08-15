'use strict';
import { Api } from './api';

function getBrandToken(){
    Api.module('brand').getBrandToken().then(brand_token=>{
        Api.setAccessToken(brand_token);
        Config.inited = true;
    }).catch(err =>{
        throw new Error(err);
    });
}

export class Config {

    defaultConfig = {
        host: 'https://innoway2.herokuapp.com/',
        facebook_app_id: '143366482876596',
        version: 'v1'
    }
    
    public static inited = false;
    
    constructor(options:any = {}){
        options = Object.assign(this.defaultConfig,Config.getSettings() || {},options);
        if(!options.brand_id){
            throw new Error("Innoway2 : Brand Id is required!");
        }
        Config.saveSettings(options);
        if(!Api.getAccessToken()){
            getBrandToken();
        }else{
            Api.module('customer').loginWithToken().then(customer =>{
                Config.inited = true;
            }).catch(err =>{
                getBrandToken();
                throw new Error(err);
            })
        }
    }

    public static get(key:string){
        var options = Config.getSettings() || {};
        return options[key]; 
    }

    public static set(key:string,value:any){
        var options = Config.getSettings();
        options[key] = value;
        Config.saveSettings(options);
        return value;
    }

    public static getSettings(){
        return JSON.parse(sessionStorage.getItem('innoway2.config'));
    }

    public static saveSettings(settings:any){
        sessionStorage.setItem('innoway2.config',JSON.stringify(settings));
    }
    
}