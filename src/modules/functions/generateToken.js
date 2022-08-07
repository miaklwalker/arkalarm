const admin = require("firebase-admin");
const serviceAccount = require("../../../google-credentials.json");

let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
module.exports = async function generateToken (name) {
    let auth = app.auth();
    return await auth.createCustomToken(name)

}

