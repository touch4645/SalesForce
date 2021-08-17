let prop = PropertiesService.getScriptProperties();

const CLIENT_ID =  prop.getProperty("CLIENT_ID");
const CLIENT_SECRET =  prop.getProperty("CLIENT_SECRET");
const USERNAME = prop.getProperty("USERNAME");
const PASSWORD = prop.getProperty("PASSWORD");

const REDIRECT_URI = prop.getProperty("REDIRECT_URI");

const ACCESS_TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";


/**
 * アクセストークンを含んだオブジェクトを取得する関数
 * 
 * @param {string} client_id SalesForceの接続アプリケーションから得られるコンシューマ鍵
 * @param {string} client_secret SalesForceの接続アプリケーションから得られるコンシューマの秘密
 * @param {string} username SalesForceの管理者ユーザーID
 * @param {string} password SalesForceの管理者ユーザーパスワード
 * @returns {Object} authrizationのオブジェクト
 */
function authorization(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, username=USERNAME, password=PASSWORD) {
  const response = UrlFetchApp.fetch(
      ACCESS_TOKEN_URL, 
      {
        "method" : "POST",
        "payload" : {
          "grant_type": "password",
          "client_id": client_id, //コンシューマ鍵
          "client_secret": client_secret, //コンシューマの秘密
          "username": username, //ユーザ名
          "password": password //パスワード
      },
      "muteHttpExceptions": true
    });
    if (response.getResponseCode() == 200) {
      return JSON.parse(response.getContentText());
    } else {
      throw new Error(response.getContentText());
    }
}


/**
 * SoQLをSalesForceにリクエストする関数
 * @param {String} q SalesForceのSoQL
 * @returns {Array<Any>} SoQLの結果SalesForceから得られる配列
 */
function query(q) {
  q = encodeURIComponent(q).replace(/%20/g, '+');

  const authInfo = authorization();
  const response = UrlFetchApp.fetch(authInfo.instance_url + "/services/data/v35.0/query/?q=" + q, {
    "method" : "GET",
    "headers" : {
      "Authorization": "Bearer " + authInfo.access_token
    },
    "muteHttpExceptions": true
  });
  
  const queryResult = JSON.parse(response.getContentText());
  let result = queryResult.records;

  let nextRecordsUrl = queryResult.nextRecordsUrl;

  while(nextRecordsUrl) {
    const nextResponse = UrlFetchApp.fetch(authInfo.instance_url + nextRecordsUrl, {
      "method" : "GET",
      "headers" : {
        "Authorization": "Bearer " + authInfo.access_token
      },
      "muteHttpExceptions": true
    });
    const nextQueryResult = JSON.parse(nextResponse.getContentText());
    result = result.concat(nextQueryResult.records);
    nextRecordsUrl = nextQueryResult.nextRecordsUrl;
  }
  return result;
}


/**
 * 全ての初回商談（更新用商談を除く）を取得する関数
 * @returns {Array<Object>} 全ての商談オブジェクト
 */
function getOpportunity() {
  let result = [];

  var records = query(
    "SELECT Id, Amount, Name, CloseDate, LastModifiedDate"
    + " FROM Opportunity"
    + " WHERE NOT Name LIKE '%クール目%'"
  );
  
  for(var i = 0; i < records.length; i++) {
    result.push({
      id: records[i].Id, //商談ID
      amount: records[i].Amount, //金額
      name: records[i].Name, //商談名
      closeDate: records[i].CloseDate //完了予定日
    });
  }
  return result;
}