const firebase = require("firebase")

firebase.initializeApp({
    apiKey: "AIzaSyBdm54bGXsbcTFtPf-d87_9bC61gySc-q4",
    authDomain: "cagamii-b28c2.firebaseapp.com",
    databaseURL: "https://cagamii-b28c2.firebaseio.com",
    projectId: "cagamii-b28c2",
    storageBucket: "cagamii-b28c2.appspot.com",
    messagingSenderId: "685647911139"
})

export default ({ store }, inject) => {
	inject("firebase", firebase)
}
