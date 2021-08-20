/**
 * SoQLをSalesForceにリクエストする関数
 * @param {String} q SalesForceのSoQL
 * @returns {Array<Any>} SoQLの結果SalesForceから得られる配列
 */
function query(q) {
  q = encodeURIComponent(q).replace(/%20/g, '+');

  const authInfo = authorization();
  const response = UrlFetchApp.fetch(authInfo.instance_url + "/services/data/v52.0/query/?q=" + q, {
    "method" : "GET",
    "headers" : {
      "Authorization": "Bearer " + authInfo.access_token

    },
    "muteHttpExceptions": true
  });
  
  const queryResult = JSON.parse(response.getContentText());

  let result = queryResult.records;
  if (result === undefined) {
    throw new Error( JSON.stringify(queryResult[0]) );
  }

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
function getAllOpportunities() {
  const records = query(
    "SELECT Id, Amount, Name, CloseDate, LastModifiedDate, closing__c"
    + " FROM Opportunity"
    + " WHERE NOT Name LIKE '%クール目%'"
  );
  return records;
}


/**
 * 全ての親取引先を取得する関数
 * @returns {Array<Object>} 全ての親取引先オブジェクト
 */
function getAllParentAccounts() {
  const records = query(
    "SELECT Id, BillingAddress, OwnerId, Name, Phone, Financial_mail_address__c"
    + " FROM Account"
    + " WHERE ParentId != NULL"
  );
  return records;
}


/**
 * 全ての取引先責任者を取得する関数
 * @returns {Array<Object>} 全ての取引先責任者オブジェクト
 */
function getAllContacts() {
  const records = query(
    "SELECT Id, Name, Name_rubi__c, MobilePhone, Email"
    + " FROM Contact"
  );
  return records;
}

/**
 * 全ての契約を取得する関数
 * @returns {Array<Object>} 全ての契約オブジェクト
 */
function getAllContracts() {
  const records = query(
    "SELECT Id, ContractNumber, StartDate, EndDate, ContractTerm, Delivery_date__c, StageName__c"
    + " FROM Contract"
  );
  return records;
}