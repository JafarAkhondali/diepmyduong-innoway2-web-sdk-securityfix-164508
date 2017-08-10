'use strict';
export class Config {

    defaultConfig = {
        host: 'https://innoway2.herokuapp.com/',
        facebook_app_id: '143366482876596',
        version: 'v1'
    }
    
    constructor(options:any = {}){
        options = Object.assign(this.defaultConfig,Config.getSettings() || {},options);
        Config.saveSettings(options);
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