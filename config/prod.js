
module.exports = {
    google:{
        clientID:process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    session:{
        name: process.env.env.SESSION_NAME,
        cookieKey: process.env.COOKIE_KEY
    },
    mongodb:{
        url: process.env.MONGO_URL
    }

}