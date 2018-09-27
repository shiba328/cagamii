const firebase = require("firebase/app")
require("firebase/auth")

export default function ({ store, route, redirect }) {
	return new Promise((resolve, reject) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var userdata = {
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					emailVerified: user.emailVerified,
					photoURL: user.photoURL
				}
				store.commit('setUser',userdata)
				resolve(user)
			} else {
				redirect('/')
			}
		});
	});
}
