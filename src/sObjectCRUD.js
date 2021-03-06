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
        "payload" : JSON.stringify(data),
        "muteHttpExceptions": true
    });

    const responseJson = JSON.parse(response.getContentText());
    if (responseJson.success === true) {
        return responseJson;
    } else {
        throw new Error( JSON.stringify(responseJson) );
    }
}


/**
 * SalesForceのレコードを更新する関数
 * sObject Basic Informationを利用しています
 * @param {String} objectApiName 更新したいSalesForceオブジェクトのAPI名
 * @param {String} recordId 更新したいSalesForceレコードのAPI名
 * @param {Object} data 更新するデータのJSON
 * @returns {Object<Any>} SalesForceからのレスポンス
 */
 function updateRecord(objectApiName, recordId, data) {
    const authInfo = authorization();
    const response = UrlFetchApp.fetch(authInfo.instance_url + `/services/data/v52.0/sobjects/${objectApiName}/${recordId}`, {
        "method" : "PATCH",
        "headers" : {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authInfo.access_token
        },
        "payload" : JSON.stringify(data),
        "muteHttpExceptions": true
    });

    if (response.getResponseCode() < 300) {
        return response;
    } else {
        throw new Error( JSON.stringify( response.getContentText() ) );
    }
}


/**
 * SalesForceのレコードを更新する関数
 * sObject Basic Informationを利用しています
 * @param {String} objectApiName 更新したいSalesForceオブジェクトのAPI名
 * @param {String} recordId 更新したいSalesForceレコードのAPI名
 * @returns {Object<Any>} SalesForceからのレスポンス
 */
 function deleteRecord(objectApiName, recordId) {
    const authInfo = authorization();
    const response = UrlFetchApp.fetch(authInfo.instance_url + `/services/data/v52.0/sobjects/${objectApiName}/${recordId}`, {
        "method" : "DELETE",
        "headers" : {
            "Authorization": "Bearer " + authInfo.access_token
        },
        "muteHttpExceptions": true
    });

    if (response.getResponseCode() < 300) {
        return response;
    } else {
        throw new Error( JSON.stringify( response.getContentText() ) );
    }
}