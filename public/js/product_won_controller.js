app.controller('ProductWonController', ['$scope', '$http', function($scope, $http) {
	var userResult = [];

	$http.get('http://127.0.0.1:3000/result').then(function(res) {
		var resultData;
		var totalPrice = 0;
   		if(res.data != null)
   		{
   			var username = sessionStorage.username;
			resultData = res.data;
			for (var i = 0; i < resultData.length; i++) {
				if(resultData[i].was_delivered == 0 && resultData[i].winer_name == username)
				{
					totalPrice += resultData[i].price;
					userResult.push(resultData[i]);
				}
			}
   		}

   		$scope.userResult = userResult;
   		$scope.totalPrice = totalPrice;
	});

	$scope.OpenPayment = function(pro_id){
		var productInfo;
		for (var i = 0; i < userResult.length; i++) {
			if(userResult[i].product_id == pro_id)
				productInfo = userResult[i];
		}

		$scope.ShowPayment = true;
		console.log(productInfo);

		$scope.productID = productInfo.product_id;
		$scope.productName = productInfo.name;
		$scope.productPriceVND = productInfo.price * 22290;
		$scope.productPriceUSD = productInfo.price;
	}
}]);