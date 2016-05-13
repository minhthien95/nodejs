app.controller('managerController',['$scope', '$http', function($scope, $http){
	$http.get('http://127.0.0.1:3000/products/notActive').then(function(res) {
        if(res.data != null || res.data.length != 0){
            $scope.productsActive = res.data;
        }
    });

	$scope.getVipUserUnActive = function(){
		$http.get('http://127.0.0.1:3000/user/getVipUserUnActive').then(function(res){
			if(res.data != null || res.data.length != 0)
			{
				$scope.vipUsersActive  = res.data;
			}
		});
	}
	$scope.getAdminUserUnActive = function(){
		$http.get('http://127.0.0.1:3000/user/getAdminUserUnActive').then(function(res){
			if(res.data != null || res.data.length != 0)
			{
				$scope.adminUsersActive  = res.data;
			}
		});
	}
	$scope.getUserUnBlock = function(){
		$http.get('http://127.0.0.1:3000/user/getUserUnBlock').then(function(res){
			if(res.data != null || res.data.length != 0)
			{
				$scope.usersBlock  = res.data;
			}
		});
	}
	$scope.getUserBlock= function(){
		$http.get('http://127.0.0.1:3000/user/getUserBlock').then(function(res){
			if(res.data != null || res.data.length != 0)
			{
				$scope.usersUnBlock = res.data;
			}
		});
	}
	$scope.getUnAdiminUser = function(){
		$http.get('http://127.0.0.1:3000/user/getUnAdiminUser').then(function(res){
			if(res.data != null || res.data.length != 0)
			{
				$scope.usersDelete  = res.data;
			}
		});
	}

    $scope.activeProduct = function(item){
		$http.put('http://127.0.0.1:3000/products/updateActiveProduct/' + item.product_id).then(function(res) {
        	alert("Success update!");
            window.location.reload();
    	});
    }

    $scope.deleteUser = function(item){
    	$http.delete('http://127.0.0.1:3000/users/deleteUser/' + item.user_id).then(function(res) {
        	alert("Success update!");
            window.location.reload();
    	});
    }

    $scope.activeAdminUser = function(item){
    	$http.put('http://127.0.0.1:3000/users/updateActiveAdminUser/' + item.user_id).then(function(res) {
        	alert("Success update!");
            window.location.reload();
    	});
    }

    $scope.activeVipUser = function(item){
    	$http.put('http://127.0.0.1:3000/users/updateActiveVipUser/' + item.user_id).then(function(res) {
        	alert("Success update!");
            window.location.reload();
    	});
    }

    $scope.blockUser = function(item){
    	$http.put('http://127.0.0.1:3000/users/blockUser/' + item.user_id).then(function(res) {
        	alert("Success update!");
            window.location.reload();
    	});
    }
    $scope.unBlockUser = function(item){
    	$http.put('http://127.0.0.1:3000/users/unBlockUser/' + item.user_id).then(function(res) {
        	alert("Success update!");
            window.location.reload();
    	});
    }
}]);