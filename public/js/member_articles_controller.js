app.controller('articlesController',['$scope', '$http', function($scope, $http){
	$scope.InfoUser = JSON.parse(sessionStorage.InfoUser);
	$scope.hideArticles = true;

	$http.get('http://127.0.0.1:3000/products/byUser/'+$scope.InfoUser.user_id).then(function(res){
		if(res.data !=null  || res.data.length != 0){
			var data = res.data[0];
			if(data==null)
			{
				$scope.hideArticles = true;
			}
			else
			{
				$scope.hideArticles = false;
				$scope.articles = res.data;
			}
		}
	});

	$scope.CreateProduct = function(){
		var success = true;
		if($('#inputName').val()=="")

		if($('#inputName').val() == "")
		{
			success = false;
		    alert("Please input product name!");
		}
		
		if($('#inputPrice').val() == "")
		{
			success = false;
		    alert("Please input price!");
		}

		/*$('#inputFile').change( function(event) {
			var tmppath = URL.createObjectURL(event.target.files[0]);
    		//$("img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
    	});
		var val = $("#inputFile").val();
		if (!val.match(/(?:gif|jpg|png|bmp)$/)) {
		    // inputted file path is not an image of one of the above types
		    success = false;
		    alert($("#inputFile").val());

		}*/

		if(success==true)
		{
			$http({
                url: 'http://127.0.0.1:3000/products/add',
                method: 'POST',
                data: {
                	name : $('#inputName').val(),
					price: $('#inputPrice').val(),
					type_product : $('#inputType').val(),
					owner_id: $scope.InfoUser.user_id,
					posted_day: new Date()
            }
	        }).then(function(res) {
	        	alert("Congratulation! Your new account has been created");
	        });
	    }
	}
}]);

app.controller('EditProductAController',['$scope', '$http', function($scope, $http){
	$scope.hideEditProductA = true;

	if($('#editProductA').val == 0)
		$scope.hideEditProductA = false;
}]);