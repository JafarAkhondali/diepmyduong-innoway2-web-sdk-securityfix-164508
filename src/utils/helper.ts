import { Config } from '../config';

declare var $:any;

export class URL {

    //Author: Dương Jerry
    //Description: get API full url
    public static apiUrl(path:string,query:any = null,params:any = null){
        var url = Config.get('host');
        if(params){
            Object.keys(params).map(key =>{
                path = path.replace(new RegExp("\{\{"+ key +"\}\}", 'g'),params[key]);
            })
        }
        if(query){
            path += "?";
            Object.keys(query).map(key =>{
                path += key+"="+query[key]+"&";
            })
            path = path.slice(0, -1);
        }
        return url+path;
    }
}

export class Vendor {
    public static loadScript(src,options:any = {}){
        console.log("Load script",src);
        return new Promise((resolve,reject)=>{
            options = Object.assign({
                id: "",
            },options);
            if (document.getElementById(options.id)) {
                resolve();
                return;
            }
            var headEl = document.getElementsByTagName('head')[0];
            var js = document.createElement("script");
            js.id = options.id;
            var timeout = setTimeout((()=>{
                reject({
                    code: 500,
                    type: "load_script_timeout",
                    message: "Load Script TimeOut"
                });
            }).bind(this),5000);
            js.onload = (()=>{
                console.log("Script loaded");
                clearTimeout(timeout);
                resolve();
            }).bind(this);
            headEl.appendChild(js);
            js.src = src;
        })
    }

    public static getCurrentLocation(){
        return new Promise((resolve,reject)=>{
            navigator.geolocation.getCurrentPosition(function(position) { 
                resolve(position.coords);
            },(failure) => {
                $.getJSON('https://ipinfo.io/geo', function(response) { 
                    var loc = response.loc.split(',');
                    var coords = {
                        latitude: loc[0],
                        longitude: loc[1]
                    };
                    resolve(coords);
                }); 
            });
        })
    }
}

export function Timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}