let prop = PropertiesService.getScriptProperties();

const CLIENT_ID =  prop.getProperty("CLIENT_ID");
const CLIENT_SECRET =  prop.getProperty("CLIENT_SECRET");
const USERNAME = prop.getProperty("USERNAME");
const PASSWORD = prop.getProperty("PASSWORD");


/**
 * アクセストークンを含んだオブジェクトを取得する関数
 * 
 * @param {string} client_id SalesForceの接続アプリケーションから得られるコンシューマ鍵
 * @param {string} client_secret SalesForceの接続アプリケーションから得られるコンシューマの秘密
 * @param {string} username SalesForceの管理者ユーザーID
 * @param {string} password SalesForceの管理者ユーザーパスワード
 * @returns {Object} authorizationのオブジェクト
 */
function authorization(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, username=USERNAME, password=PASSWORD) {
  const response = UrlFetchApp.fetch("https://login.salesforce.com/services/oauth2/token", {
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
