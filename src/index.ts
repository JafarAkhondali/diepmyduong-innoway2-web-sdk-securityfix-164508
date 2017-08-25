'use strict';
import {  Config } from './config';
import { Api } from './api';

declare var module:any;

module.exports = {
    init: (options:any) =>{
        new Config(options);
    },
    api: Api,
    config: Config
}
