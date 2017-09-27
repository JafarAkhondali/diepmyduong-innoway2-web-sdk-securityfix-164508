import { Base } from './base'
import * as firebase from 'firebase'

declare var $:any;

export class Firebase extends Base {

    config = {
        apiKey: "AIzaSyCV7iiP9I8axVH3zT1AzltHlvcDWYoOySs",
        authDomain: "dashboard-version-2-0.firebaseapp.com",
        databaseURL: "https://dashboard-version-2-0.firebaseio.com",
        projectId: "dashboard-version-2-0",
        storageBucket: "dashboard-version-2-0.appspot.com",
        messagingSenderId: "16906134069"
    }
    
    hasNotifyPermission = false
    events:any = {
        ON_TOKEN_CHANGE: "on_token_change",
        ON_MESSAGE: 'on_message'
    }
    current_token:string

    constructor(){
        super("auth");
        firebase.initializeApp(this.config);
        this.messaging.requestPermission()
        .then(()=>{
            this.hasNotifyPermission = true
            this.handleRefeshToken()
            this.handleMessages()
        }).catch(err =>{
            this.hasNotifyPermission = false
        })
    }

    get instance(){
        return firebase
    }

    get messaging(){
        return firebase.messaging()
    }

    get auth(){
        return firebase.auth()
    }

    get database(){
        return firebase.database()
    }

    get storage(){
        return firebase.storage()
    }

    async getMessageToken(){
        try {
            let token = await this.messaging.getToken()
            if(!token){
                await this.messaging.requestPermission()
                this.hasNotifyPermission = true
                return await this.getMessageToken()
            }
            $(this).trigger(this.events.ON_TOKEN_CHANGE,token)
            return token
        }catch(err){
            console.log('Cannot get message token', err.message)
            return null
        }
    }

    private handleRefeshToken(){
        this.messaging.onTokenRefresh(function() {
            this.getToken()
        });
    }

    private handleMessages(){
        this.messaging.onMessage(function(payload) {
            $(this).trigger(this.events.ON_MESSAGE,payload)
        });
    }
}