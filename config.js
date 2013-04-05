module.exports = {
	development: {
		express: {
			session_secret: 'Y1CQ48827b19n6Fm8X13zU7a3no2Tz'
		}
		, twitter: {
			consumer_key: 'HtMmKS6nV7c0u118QoYmw'
			, consumer_secret: 'J8JGTGJegZ1G6dzN2syMWdz3JVEIHzANtK1mWYfTEg'
			, callbackURL: "http://localhost:5000/auth/twitter/callback"
		}
		, slideshare: {
			host: 'www.slideshare.net'
			, endpoints: {
				upload: '/api/2/upload_slideshow'
				, get: '/api/2/get_slideshow'
			}
			, api_key: 'lQv72N4h'
			, shared_secret: 'LiGvQRXM'
			, username: 'danielyanisse'
			, password: 'Danysurf88'
		}
		, mogreet: {		
		}
	}
	, production: {
		express: {
			session_secret: 'Y1CQ48827b19n6Fm8X13zU7a3no2Tz'
		}
		, twitter: {
			consumer_key: 'HtMmKS6nV7c0u118QoYmw'
			, consumer_secret: 'J8JGTGJegZ1G6dzN2syMWdz3JVEIHzANtK1mWYfTEg'
			, callbackURL: "http://slidz.herokuapp.com/auth/twitter/callback"
		}
		, slideshare: {
			host: 'www.slideshare.net'
			, endpoints: {
				upload: '/api/2/upload_slideshow'
				, get: '/api/2/get_slideshow'	
			}
			, api_key: 'lQv72N4h'
			, shared_secret: 'LiGvQRXM'
			, username: 'danielyanisse'
			, password: 'Danysurf88'
		}
		, mogreet: {		
		}
	}
}