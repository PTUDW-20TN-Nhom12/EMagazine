export function getMoMo(user_id: number, price: number) {
    var partnerCode = "MOMOIQA420180417";
    var accessKey = "Q8gbQHeDesB2Xs0t";
    var secretkey = "PPuDXq1KowPT1ftR8DvlQTHhC03aul17";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "Thanh toán premium EMagazine";
    var redirectUrl = "emagazine-ptudw-20tn-nhom12.onrender.com";
    var ipnUrl = "emagazine-ptudw-20tn-nhom12.onrender.com/payment/ipn/" + user_id;
    var amount = price.toString();
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores
    
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        // accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
        lang: 'en'
    });
    //Create the HTTPS objects
    const https = require('https');
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    }
    return new Promise<string>((resolve, reject) => {
        //Send the request and get the response
        const req = https.request(options, res => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                resolve(JSON.parse(body).payUrl)
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })
        
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            reject(e.message);
        });
        req.write(requestBody);
        req.end();
    })
}