/**
 * SoQLをSalesForceにリクエストする関数
 * @param {String} q SalesForceのSoQL
 * @returns {Array<Any>} SoQLの結果SalesForceから得られる配列
 */
function createRecord(ObjectApiName, data) {
    const authInfo = authorization();
    const response = UrlFetchApp.fetch(authInfo.instance_url + `/services/data/v52.0/sobjects/${ObjectApiName}/`, {
        "method" : "POST",
        "headers" : {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authInfo.access_token
        },
        "payload" : data,
        "muteHttpExceptions": true
    });

    const response = JSON.parse(response.getContentText());
    if (response.success === true) {
        return response;
    } else {
        throw new Error( JSON.stringify(response) );
    }
  }