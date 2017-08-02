'use strict';
export class Config {

    constructor(options:any = {}){
        var options:any = {
            host: 'https://jerry-chatbot.herokuapp.com/',
            facebook_app_id: '143366482876596'
        }
        options = Object.assign(options,Config.getSettings(),options);
        Config.saveSettings(options);
    }

    public static get(key:string){
        var options = Config.getSettings();
        return options[key]; 
    }

    public static set(key:string,value:any){
        var options = Config.getSettings();
        options[key] = value;
        Config.saveSettings(options);
        return value;
    }

    public static getSettings(){
        return JSON.parse(sessionStorage.getItem('chatgut.config'));
    }

    public static saveSettings(settings:any){
        sessionStorage.setItem('chatgut.config',JSON.stringify(settings));
    }
}