const PayU = require("payu-websdk")

const payu_key ="gtKFFx"
const payu_salt ="4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW"

// create a client

const payuClient = new PayU({
    key:payu_key,
    salt:payu_salt
},process.env.PAYU_ENVIRONMENT)

exports.PayData = {
    payuClient,
    payu_key,
    payu_salt

}