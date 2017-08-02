import { Config } from '../config';

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