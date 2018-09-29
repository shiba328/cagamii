const firebase = require("firebase")

firebase.initializeApp({
    apiKey: "AIzaSyC1m5I3MdJMYR2uCBvvVJCzFLZAYDgEPXg",
    authDomain: "cagamii-b28c2.firebaseapp.com",
    databaseURL: "https://cagamii-b28c2.firebaseio.com",
    projectId: "cagamii-b28c2",
    storageBucket: "cagamii-b28c2.appspot.com",
    messagingSenderId: "685647911139"
})

export default ({ store }, inject) => {
	inject("firebase", firebase)
}
