var app = angular.module('online_auction', ['ngRoute', 'ngAnimate', 'ngResource', 'ngSanitize']);

app.config(function($routeProvider) {
    $routeProvider
    	.when('/all/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/smartphone/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/laptop/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/tablet/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/headphone/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/sound/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/others/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/latest_products/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/highest_rating/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/low_to_high/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
    	.when('/high_to_low/', {
    		templateUrl: 'views/being_auctioned.html'
    	})
        .when('/search/', {
            templateUrl: 'views/being_auctioned.html'
        })
    	.when('/product_detail/product_id=:product_id', {
    		templateUrl: 'views/product_detail.html'
    	})
    	.when('/result/', {
    		templateUrl: 'views/result.html',
    	})
    	.when('/document/', {
    		templateUrl: 'views/Tutorial//tutorial-documents.html',
    	})
    	.when('/video/', {
    		templateUrl: 'views/Tutorial/tutorial-videos.html',
    	})
    	.when('/popular_question/', {
    		templateUrl: 'views/Tutorial/tutorial-questions.html',
    	})
    	.when('/contactus/', {
    		templateUrl: 'views/contactus.html',
    	})
        .when('/profile/', {
            templateUrl: 'views/Member/profile.html',
        })
        .when('/transition_history/', {
            templateUrl: 'views/Member/transition_history.html',
        })
        .when('/message/', {
            templateUrl: 'views/Member/message.html',
        })
        .when('/change_password/', {
            templateUrl: 'views/Member/change_password.html',
        })
        .when('/change_profile/', {
            templateUrl: 'views/Member/change_profile.html',
        })
        .when('/manager/', {
            templateUrl: 'views/Member/manager.html',
        })
        .when('/articles/', {
            templateUrl: 'views/Member/articles.html',
        })
        .when('/sign_up/', {
            templateUrl: 'views/sign_up.html',
        })
        .when('/forgot_password/', {
            templateUrl: 'views/forgot_password.html',
        })
        .when('/user_message/username=:username', {
            templateUrl: 'views/product_won.html',
        })
		.otherwise({
			 templateUrl: 'views/being_auctioned.html'
		});
});