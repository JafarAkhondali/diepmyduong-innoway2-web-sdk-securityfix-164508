import { Base } from './base';
import { Api } from 'api';
import { Config } from 'config';
import { Vendor,Timeout } from 'utils/helper';
import { Info } from './info'
import { Firebase } from './firebase'

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
    firebase_token:string
    firebase_id_token:string
    firebase_message_token:string
    firebase_account:any
    
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
            await this.loginFirebaseAccount(token)
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
            await this.loginFirebaseAccount(this.employee_token)
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
        Api.setAccessToken(token)
        this.userInfo = undefined
        this.authenticated = false
        await this.logoutFirebaseAccount()
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

    async loginFirebaseAccount(token){
        let infoService:Info = Api.module('info')
        let firebaseService:Firebase = Api.module('firebase')
        let tokenInfo = await infoService.getTokenInfo(token)
        if(tokenInfo.payload.firebase_token){
            this.firebase_account = await firebaseService.auth.signInWithCustomToken(tokenInfo.payload.firebase_token)
            this.firebase_token = await this.firebase_account.getToken()
            this.firebase_id_token = await this.firebase_account.getIdToken()
            this.firebase_message_token = await firebaseService.getMessageToken()
        }else{
            throw new Error('Cannot sign up firebase with this token')
        }
    }

    async logoutFirebaseAccount(){
        let firebaseService:Firebase = Api.module('firebase')
        await firebaseService.auth.signOut()
        this.firebase_account = null
        this.firebase_token = null
        this.firebase_id_token = null
        this.firebase_message_token = null
    }
}