import { Api } from '../api';
import { URL } from '../utils/helper';
import { Config } from '../config';

export class Base {
    module = "";

	constructor(module){
        this.module = module;
    }
    
    get access_token(){
        return Api.getAccessToken();
    }

    async exec(settings){
        return await Api.exec(settings);
    }

    url(path = "",query = {},params = {}){
        var node = this.module+path;
        return Api.Url(node,query,params);
    }
}