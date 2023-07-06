import https from "https";
export function checkToken(token: string): Promise<boolean> {

    const data = {
        secret: "6LdxdfomAAAAAIlS5PI4mWW38ulNmTCVObf6g3kz",
        response: token,
    };

    const requestBody = `?secret=${data.secret}&response=${data.response}`;

    const options = {
        hostname: 'www.google.com',
        port: 443,
        path: '/recaptcha/api/siteverify' + requestBody,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0
        }
    }

    return new Promise<boolean>((resolve, reject) => {
        const req = https.request(options, res => {
            // console.log(`Status: ${res.statusCode}`);
            // console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
            res.on('data', (body) => {
                console.log(JSON.parse(body))
                resolve(JSON.parse(body).success);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })
        
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            reject(false);
        });
        req.end();
    });
}