import { Base } from './base';
import { Api } from '../api';
import { Config } from '../config';
import { Vendor,Timeout } from '../utils/helper';

declare var $,AccountKit,window:any;
export class Auth extends Base {
    constructor(){
        super("auth");
    }
    events:any = {
        AUTH_STATE_CHANGE: "on_auth_change"
    }

    private _authState:boolean;
    userInfo:any
    anonymous_token:string
    customer_verify_token:string
    employee_token:string
    customer_token:string
    
    set authenticated(state:boolean){
        this._authState = state;
        $(this).trigger(this.events.AUTH_STATE_CHANGE,this._authState);
    }

    async getAuthState(){
        if(this._authState === undefined){
            let token = await this.getAccessToken();
            let user = await this.loginWithToken(token);
            if(user){
                return true;
            }else{
                return false;
            }
        }else{
            return this._authState;
        }
    }

    async getAnonymouseToken(brand_id:string){
        let query = { brand_id }
        
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/get_anonymouse_token',query),
            "method": "GET"
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        this.anonymous_token = row.brand_token
        return this.anonymous_token
    }

    async loginWithToken(token:string){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/login_with_token'),
            "method": "GET",
            "headers": {
                access_token: token
            }
        }
        try {
            let res:any = await this.exec(settings)
            let row = res.results.object
            this.userInfo = row
            Api.setAccessToken(token)
            this.authenticated = true
            return row
        }catch(err){
            console.log('login with token error',err);
            let token = await this.getAnonymouseToken(Config.get('brand_id'))
            Api.setAccessToken(token)
            this.authenticated = false
            return null
        }
        
    }

    async LoginWithEmailAndPassword(email,password){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/login'),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                access_token: access_token
            },
            "data": JSON.stringify({
                email,
                password
            })
        }
        try {
            let res:any = await this.exec(settings)
            let row = res.results.object
            this.userInfo = row.user
            this.employee_token = row.access_token
            Api.setAccessToken(row.access_token)
            this.authenticated = true
            return row
        }catch(err){
            this.authenticated = false
            throw err
        }
    }

    async logout(){
        let token = await this.getAnonymouseToken(Config.get('brand_id'))
        Api.setAccessToken(token);
        this.userInfo = undefined;
        this.authenticated = false;
        return true;
    }

    private async customerVerifyToken(){
        let token = await this.getAnonymouseToken(Config.get('brand_id'))
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/customer_verify_token'),
            "headers": {
                "access_token": token,
            },
            "method": "GET"
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        this.customer_verify_token = row.verify_token
        return this.customer_verify_token
    }

    async AKitVerify(authStateInfo){
        if(!this.customer_verify_token) throw new Error('customer_verify_token undefined in AKitVerify')
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url("/customer_verify_phone"),
            "method": "POST",
            "headers": {
                "access_token": this.customer_verify_token,
                "content-type": "application/json",
            },
            "processData": false,
            "data": JSON.stringify(authStateInfo)
        }
        try {
            let res:any = await this.exec(settings);
            let row = res.results.object
            this.userInfo = row.customer
            this.customer_token = row.access_token
            Api.setAccessToken(this.customer_token )
            this.authenticated = true
            return row
        }catch(err){
            this.authenticated = false
            throw err
        }
    }

    async AKitInit(){
        let token = this.customer_verify_token || await this.customerVerifyToken()
        let tokenInfo = await Api.module('info').getTokenInfo(token);
        let options = tokenInfo.payload;
        if(typeof AccountKit === "undefined" || typeof AccountKit.init === "undefined"){
            let accountkitSrc = "https://sdk.accountkit.com/"+options.locale+"/sdk.js";
            await Vendor.loadScript(accountkitSrc,{id: "accoutkit_sdk"});
            while(typeof AccountKit === "undefined" || typeof AccountKit.init === "undefined" ){
                await Timeout(500);
            }
            AccountKit.init({
                appId:    options.app_id, 
                state:    options.state, 
                version:  options.version,
                fbAppEventsEnabled:true
            });
        }
        return options;
    }

    AKitLogin(countryCode,phoneNumber){
        return new Promise((resolve,reject)=>{
            AccountKit.login('PHONE', {
                countryCode: countryCode, 
                phoneNumber: phoneNumber
            },(response) => {
                if (response.status === "PARTIALLY_AUTHENTICATED") {
                    this.AKitVerify({
                        state: response.state,
                        code: response.code
                    }).then(user =>{
                        resolve(user);
                    }).catch(err=>{
                        reject(err);
                    })
                } else if (response.status === "NOT_AUTHENTICATED") {
                    reject({
                        code: 500,
                        type: "NOT_AUTHENTICATED",
                        message: "NOT AUTHENTICATED"
                    })
                }else if (response.status === "BAD_PARAMS") {
                    reject({
                        code: 500,
                        type: "BAD_PARAMS",
                        message: "BAD PARAMS"
                    })
                }
            });
        })    
    }
}