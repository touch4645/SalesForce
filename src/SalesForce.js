var AUTHORIZATION_URL = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`;
var ACCESS_TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";
var CLIENT_ID = "input your client_id";
var CLIENT_SECRET = "input your client_secret";
var REDIRECT_URI = "https://script.google.com/macros/s/********************/usercallback";

/**
 * メニューの設定
 */
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Salesforce Utility", [
    {name:"OpenDialog", functionName: "openDialog"}
  ]);
}

/**
 * ダイアログを開く
 */
function openDialog() {
  var prop = PropertiesService.getUserProperties();
  var template = HtmlService.createTemplateFromFile("dialog");
  var authorization_url = AUTHORIZATION_URL;
  authorization_url = authorization_url.replace("{client_id}", CLIENT_ID);
  authorization_url = authorization_url.replace("{redirect_uri}", encodeURIComponent(REDIRECT_URI));
  authorization_url = authorization_url.replace("{state}", ScriptApp.newStateToken().withMethod("callback").withTimeout(120).createToken());
  
  template.authorization_url = authorization_url
  SpreadsheetApp.getActive().show(template.evaluate());
}

/**
 * OAuthでコールバックされたcode値を元にaccess_tokenを取得・保持する。
 */
function callback(e) {
  var code = e.parameter.code;
  var res = UrlFetchApp.fetch(ACCESS_TOKEN_URL, {
    "method" : "POST",
    "payload" : {
      "grant_type" : "authorization_code",
      "code" : code,
      "redirect_uri" : REDIRECT_URI,
      "client_id" : CLIENT_ID,
      "client_secret" : CLIENT_SECRET
    }
  });

  var prop = PropertiesService.getUserProperties();
  prop.setProperty("session_info", res.getContentText());

  return HtmlService.createHtmlOutput("<div>windowを閉じて!!</div>");
}