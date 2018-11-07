/*----------------------------------
 - variables.js -
 JS全般で利用されるグローバル変数定義
----------------------------------*/

import {Level} from "constants"
// const debug = process.env.NODE_ENV !== 'production'
const debug = false;

export default {
  //#### Param [System]
  System: {
    logLevel: debug ? Level.DEBUG : Level.INFO
  },
  //#### Param [Session]
  Session: {
    key: 'so'
  },
  //#### Param [Api]
  Api: {
    //## Time out for API request(Ajax) in milisecond
    timeout: 120000,
    //## Time out for file upload in milisecond
    timeoutUpload: 300000,

    //#### for local-api-test
    //## API base path to Application Server

    root: debug ? 'http://localhost:3000/' :'https://ckintazw7k.execute-api.ap-northeast-1.amazonaws.com/production/',

    //#### for remote-api-test
    //## API base path to Application Server
    //root: 'http://192.168.xxx.xxx/api'
  }
}
