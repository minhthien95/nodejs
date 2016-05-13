app.controller('RatingProductController', ['$scope', '$http', '$sce','$rootScope', function($scope, $http, $sce,$rootScope) {
	$rootScope.isLoginForRating = false;
	$rootScope.isRated = false;
	if(sessionStorage.username != null)
		$rootScope.isLoginForRating = true;

	$rootScope.getUserRate = function(pro_id){
		if(pro_id == null || sessionStorage.username == null)
			return;
			var query = 'http://127.0.0.1:3000/rate/' + pro_id + '/' + sessionStorage.user_id;
			$http.get(query).then(function(res) {
				if(res.data.length != 0){
					var data = res.data[0].ratio;
					var star = "star-" + data;
					document.getElementById(star).checked = true;
					$rootScope.isRated = true;
				}
			});
	
	}
	
	$rootScope.$on("LogOut", function(){
        $rootScope.isRated = false;
        $rootScope.isLoginForRating = false;
        if(document.getElementById("star-1") != null)
        	document.getElementById("star-1").checked = false;

        if(document.getElementById("star-2") != null)
        	document.getElementById("star-2").checked = false;

        if(document.getElementById("star-3") != null)
        	document.getElementById("star-3").checked = false;

        if(document.getElementById("star-4") != null)
        	document.getElementById("star-4").checked = false;

        if(document.getElementById("star-5") != null)
        	document.getElementById("star-5").checked = false;
    });

    $scope.ratingPro = function(id,pro_id){
    	var ratio = id;
    	var maxindex = 0;
    	var u_id = sessionStorage.user_id;
		$http.get('http://127.0.0.1:3000/maxrateindex').then(function(res) {
			if(res.data.length != 0){
				maxindex = res.data[0].max_id + 1;
			}
		});
    	$http({
                url: 'http://127.0.0.1:3000/rate/add',
                method: 'POST',
                data: {
                	'rate_id': maxindex,
                    'product_id': pro_id,
                    'user_id': u_id,
                    'ratio': ratio
            	}
	        }).then(function(res) {
	        	alert("Thank you!");
	        	$rootScope.isRated = true;
        });
    };
}]);