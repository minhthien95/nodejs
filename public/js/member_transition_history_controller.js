app.controller('transHisController',['$scope', '$http', function($scope, $http){
	$scope.InfoUser = JSON.parse(sessionStorage.InfoUser);
	$http.get('http://127.0.0.1:3000/list_bid/byUser/'+ $scope.InfoUser.user_id).then(function(res) {
        if(res.data != null || res.data.length != 0){
            $scope.listBids = res.data;
        }
    });
}]);