/**
 * SalesForceに新規レコードを作成する関数
 * sObject Basic Informationを利用しています
 * @param {String} objectApiName レコードを追加したいSalesForceオブジェクトのAPI名
 * @param {Object} data 追加するデータのJSON
 * @returns {Object<Any>} SalesForceからのレスポンス
 */
function createRecord(objectApiName, data) {
    const authInfo = authorization();
    const response = UrlFetchApp.fetch(authInfo.instance_url + `/services/data/v52.0/sobjects/${objectApiName}/`, {
        "method" : "POST",
        "headers" : {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authInfo.access_token
        },
        "payload" : JSON.parse(data),
        "muteHttpExceptions": true
    });

    const response = JSON.parse(response.getContentText());
    if (response.success === true) {
        return response;
    } else {
        throw new Error( JSON.stringify(response) );
    }
  }