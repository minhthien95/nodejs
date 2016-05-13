app.controller('HomeController', ['$scope', '$http', function($scope, $http)  {
	if(sessionStorage.curPage == null)
		sessionStorage.curPage = 1;

	var selectedCategory = sessionStorage.selectedCategory;
	if(selectedCategory == null) {
		selectedCategory = 'All';
	}

	var temporary = sessionStorage.filter; 
	if(temporary == null) 
		sessionStorage.filter = 'latest_products';

	function HandleProduct(productData){
		//Create page
    	var numPage = new Array();
    	var k = 1;
    	var t = 24;
    	while(productData.length - t > 0){
    		k++;
    		t+=24;
    	}

    	for (var i = 1; i <= k; i++) {
    		numPage.push(i);
    	}
    	$scope.PageIndex = numPage;
    	var curPage = sessionStorage.curPage;
		
		//Load a part of data
    	var data = new Array();
    	if(productData.length > 24)
    	{
	    	for (var i = 24*(curPage-1); i < 24 * curPage; i++) {
	    		if(productData[i] != null)
	    			data.push(productData[i]);
    		}
    	}
    	else
			data = productData;

		sessionStorage.filter = 'latest_products';
		$scope.products = data;
	}

	if(selectedCategory == 'All')
	{
		var filter = sessionStorage.filter;
		if(filter == 'latest_products'){ 
		    $http.get('http://127.0.0.1:3000/products').then(function(res) {
				var productData = null;
				if(res.data != null)
				 	productData = res.data;
				HandleProduct(productData);
			});
		} else if(filter == 'search'){
			SearchProduct();
		} else if(filter == 'highest_rating'){
			HandleHighestRating();
		}
		else{
			$http.get('http://127.0.0.1:3000/products/all/' + filter).then(function(res) {
				var productData = null;
				if(res.data != null)
				 	productData = res.data;
				HandleProduct(productData);
			});
		}
	}
	else
	{
		var filter = sessionStorage.filter;
		if(filter == 'latest_products'){
			$http.get('http://127.0.0.1:3000/products/type_product/' + selectedCategory).then(function(res) {
				var productData = null;
				if(res.data != null)
				 	productData = res.data;
				HandleProduct(productData);
			});
		}
		else if(filter == 'highest_rating'){
			HandleHighestRating();
		}
		else if(filter == 'low_to_high'){
			$http.get('http://127.0.0.1:3000/products/low_to_high/' + selectedCategory).then(function(res) {
				var productData = null;
				if(res.data != null)
				 	productData = res.data;
				HandleProduct(productData);
			});
		}
		else if(filter == 'high_to_low'){
			$http.get('http://127.0.0.1:3000/products/high_to_low/' + selectedCategory).then(function(res) {
				var productData = null;
				if(res.data != null)
				 	productData = res.data; console.log(productData);
				HandleProduct(productData);
			});
		}else if(filter == 'search'){
			SearchProduct();
		}
	}

	$scope.FilterClick = function(type){
		//Save value of textbox Search
		if(type == 'search')
            sessionStorage.searchName = document.getElementById("strname").value;

		sessionStorage.filter = type;
	}

	function HandleHighestRating(){
		$http.get('http://127.0.0.1:3000/products/all/' + filter).then(function(res) {
			var productData = [];
			var newData = [];
			if(res.data != null)
			{
				var tempData = res.data;
				var sum = 0, max = 0, id = 1, num = 0, percent = 0, curI = -1, curNum = 0;

				while (tempData.length != 1){
					for (var i = 0; i < tempData.length; i++) {
						if(id == 0)
							id = tempData[i].product_id;

						if(tempData[i].product_id == id){
							if(tempData[i].ratio != null)
								sum += tempData[i].ratio;
							num ++;
						}
						else{ 
							if(num != 0){
								percent = sum/num;

								if(max < percent){
									max =percent;
									curI = i;
									curNum = num;
								}
								if(curNum == 0)
									curNum = num;
								if(curI == -1)
									curI = i;
							}
							id =0; 
							sum= 0;
							num = 0;
							i--;
						}
					}

					var dis = curI - curNum;
					productData.push(tempData[dis]);
					max = 0;
					id = 0;
					sum= 0;
					num = 0;

					//Remove data contain max rate 
					if(dis >= 0)
						tempData.splice(dis, curNum);

					curNum = 0;
					curI = -1;
				}

				productData.push(tempData[0]);
				if(selectedCategory != 'All'){
					for (var i = 0; i < productData.length; i++) {
						var typeProduct = productData[i].type_product;

						if(typeProduct == selectedCategory && productData[i].was_activated == 1 && productData[i].was_sold == 0){
							newData.push(productData[i]);
						}	
					}
				}
				else{
					for (var i = 0; i < productData.length; i++) {
						if(productData[i].was_activated == 1 && productData[i].was_sold == 0){
							newData.push(productData[i]);
						}
					}
				}
			}
			HandleProduct(newData);
		});
	}

	function SearchProduct(){
		var strName = sessionStorage.searchName;
		if(strName != null && strName.length > 0){
			$http.get('http://127.0.0.1:3000/products/search/' + strName).then(function(res) {
				var productData = null;
				if(res.data != null)
				 	productData = res.data;
				HandleProduct(productData); 
			});
		}
		sessionStorage.removeItem("searchName");
		sessionStorage.filter = 'latest_products';
	}
}]);

app.controller('TimeController', function($scope, $timeout) {
	var hh = 0;
	var mm = 0;
	var ss = 0;
	var timeout = 0;

	$scope.RemainingTime = function(end_date){

		var a = new Date(end_date);
		var c = new Date(Date.now());
		var total = a - c;

		total = total/(1000*60*60);

		var hour2 = Math.floor(total);
		var minute2 = Math.floor((total - hour2)*60);

		hh = hour2;
		mm = minute2;
		ss = Math.floor(((total - hour2)*60 - minute2)*60);

		//Show information in produc detail if time < 0
		$scope.hideSold = false;
		if(hh < 0 || mm < 0){
	    	$scope.hideBidForm = true;
	    	$scope.showWiner = true;
	    	$scope.winer = sessionStorage.proWiner;
	    	$scope.hideSold = true;
	    }

		$scope.hour = hour2;
		$scope.minute = minute2;
	}

	$scope.ReverseTime = function()
	{
		$timeout(function(){
			var end_date = sessionStorage.proEndDay;
			$scope.RemainingTime(end_date);
			if(hh < 0 || mm < 0){
		    	document.getElementById('hour').innerText = "00";
		    	document.getElementById('minute').innerText = "00";
		    	document.getElementById('sencond').innerText = "00";
			}
			else{
				$scope.StartTime();
			}
		}, 1500)
	}

	$scope.StartTime = function(){
	    if (ss == -1){
	        mm -= 1;
	        ss = 59;
	    }
	 
	    if (mm == -1){
	        hh -= 1;
	        mm = 59;
	    }
	 
	    if (hh == -1 || document.getElementById('hour') == null){
	        clearTimeout(timeout);
	        return false;
	    }

	    document.getElementById('hour').innerText = hh.toString();
	    document.getElementById('minute').innerText = mm.toString();
	    document.getElementById('sencond').innerText = ss.toString();
	 
	    timeout = $timeout(function(){
	        ss--;
	        $scope.StartTime();
	    }, 1000);
	}
});

app.controller('PageController', function($scope){
	$scope.PageClick = function(id){
		sessionStorage.curPage = id;
	}

	$scope.PageActive = function(id){
		if(sessionStorage.curPage == null)
			sessionStorage.curPage = 1;

		var curPage = sessionStorage.curPage;
		if(id == curPage)
			return "active";
		else
			return "";
	}
});

app.controller("ImageController", ['$scope', '$http', '$sce', function($scope, $http, $sce){
	var curProID = sessionStorage.curProID;
	if(curProID == null){
		var htmlCode = location.href;
		if(htmlCode.indexOf("/product_id") != -1)
		{
			var temp = htmlCode.split("=");
			var curProID = temp[1];
		}
	}

	if(curProID != null){
		//Find more image for product detail
		$http.get('http://127.0.0.1:3000/image/' + curProID).then(function(res) {
			var imageArr = null;
			if(res.data != null)
			 	imageArr = res.data;

			var htmlImage = "";
			for(var i=0; i< imageArr.length; i++)
			{
	            htmlImage += '<div class="col-xs-3 col-md-3"  style="margin-left: -4px;">'+
	            			'<button class = "btn" ng-click = "ChangeImage(\''+imageArr[i].name +'\')">'+
	                            '<img src="images/Products/' + imageArr[i].name + '" alt="" width = "50px" height = "40px"/>'+
	                        '</button></div> ';
			}

			$scope.image = '<img src="images/Products/'+ imageArr[0].name +'" alt=""/>';
			$scope.subImage = htmlImage;
		});
	}

	//Use to find image for each product in being auctioned
	$scope.FindImage = function(pro_id){
		$http.get('http://127.0.0.1:3000/image/' + pro_id).then(function(res) {
			var imageArr = null;
			if(res.data != null)
			 	imageArr = res.data;
			if(imageArr[0] == null)
			 	$scope.mainImage  = "unknow.jpg";
			else
				$scope.mainImage = imageArr[0].name;
		});
	}

	//Change main image in product detail when press sub-image
	$scope.ChangeImage = function(name){
		$scope.image = '<img src="images/Products/' + name + '" alt=""/>'
	}
	
	$scope.ShowImage = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

app.directive('din', function($compile, $parse) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
})