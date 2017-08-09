import { Api } from '../api';
import { URL } from '../utils/helper';
import { Config } from '../config';

export class Base {

    items = [];
    module = "";
    path = "";

	constructor(module){
        this.module = module;
        this.path = 'api/'+Config.get('version')+'/'+this.module;
    }

    getAll(filter = {}){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": URL.apiUrl(this.path),
          "method": "GET",
        }
        return Api.exec(settings);
    }

    get(){

    }

    update(){

    }

    delete(){

    }

    add(){

    }

}