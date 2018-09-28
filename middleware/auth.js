const firebase = require("firebase/app")
require("firebase/auth")

export default function ({ store, route, redirect }) {
	let p = new Promise((resolve, reject) =>{
		firebase.auth().languageCode = 'jp';
		firebase.auth().onAuthStateChanged((user) => {
			if(user){
				var userdata = {
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					emailVerified: user.emailVerified,
					photoURL: user.photoURL
				}
				store.commit('setUser',userdata)
				resolve(user)
			}else{
				reject("error")
			}
		});
	})
	return p.catch(function(e){
		console.log(e)
		if(route.name != 'index' && route.name != 'login'){
			redirect('/')
		}
	})
	
}
