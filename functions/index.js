const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const auth = admin.auth();


exports.agregarAdministrador = functions.https.onCall((data, context) => {
    /* if(context.auth.token.admin !== true){
        return {error: 'no tienes los permisos'}
    } */

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, { admin: true })
        })
        .then(() => {
            return { message: 'Se creo el administrador' }
        })
        .catch(error => {
            return { error: error }
        })
})

exports.eliminarAdministrador = functions.https.onCall((data, context) => {

    if (context.auth.token.admin !== true) {
        return { error: 'no tienes los permisos' }
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, { admin: false })
        })
        .then(() => {
            return { message: 'No mas admin' }
        })
        .catch(error => {
            return { error: error }
        })
})


exports.crearAutor = functions.https.onCall((data, context) => {

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, { autor: true })
        })
        .then(() => {
            return { message: 'Es autor' }
        })
        .catch(error => {
            return { error: error }
        })
})


exports.eliminarAutor = functions.https.onCall((data, context) => {

    if (context.auth.token.admin !== true) {
        return { error: 'no tienes los permisos' }
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, { autor: false })
        })
        .then(() => {
            return { message: 'No mas autor' }
        })
        .catch(error => {
            return { error: error }
        })
})



const clientId = functions.config().paypal.client_id;
const secretKey = functions.config().paypal.secret_key;
const paypal = require("@paypal/checkout-server-sdk");

const env = new paypal.core.SandboxEnvironment(clientId, secretKey); //Cambiar a liveEnvironment
const client = new paypal.core.PayPalHttpClient(env);
let request = new paypal.orders.OrdersCreateRequest();


exports.paypalCreateOrder = functions.https.onCall(async(data, context)=>{
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": "1.00"
                }
            }
        ]
    })
    const response = await client.execute(request);

    return response.result;
});


exports.payplHandleOrdes = functions.https.onCall(async(data, context)=>{
    const orderId = data.orderId;
    request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await clientexecute(request);

    return response.result;
})