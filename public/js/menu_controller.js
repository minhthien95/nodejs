app.controller('MenuController',['$scope', '$http', '$rootScope', function($scope, $http, $rootScope)  {
	$scope.hideUsername = true;
	$scope.hideRegister = false;
	$scope.hideAdminUser = true;
	$scope.hideVipUser = true;

	//Show message with the number of product user won
	if(sessionStorage.numCart != null)
	{
		if(sessionStorage.numCart == 0){
   			$scope.cartLink = "";
		}
		else{
			var username = sessionStorage.username;
			$scope.cartLink = "#user_message/username=" + username;
		}
		
		$scope.numProduct = sessionStorage.numCart;
	}

	var curUsername = localStorage.getItem("username");
	if(curUsername == null)
		curUsername = sessionStorage.username;
	else{
		GetUserResult();
		sessionStorage.username = curUsername;
	}

	if(curUsername != null)
	{
		$scope.hideUsername = false;
		$scope.hideAdminUser = false;
		$scope.hideRegister = true;
		$scope.hideVipUser = false;
		$scope.username = curUsername;
	}

	$scope.SelectCategory = function (newCategory) {
		if(newCategory == 'Smartphone' || newCategory == 'Laptop' || newCategory == 'Tablet' || 
			newCategory == 'Headphone' || newCategory == 'Sound' || newCategory == 'Others' || newCategory == 'All')
				sessionStorage.selectedCategory = newCategory;

		sessionStorage.MenuItem = newCategory;
	}

	$scope.ItemActive = function (newCategory) {
		var menuItem = sessionStorage.MenuItem;
		if(menuItem == null)
			menuItem = 'All';

		if(menuItem == 'Smartphone' || menuItem == 'Laptop' || menuItem == 'Tablet' || 
			menuItem == 'Headphone' || menuItem == 'Sound' || menuItem == 'Others' || menuItem == 'All')
		{
			if(newCategory == 'All' || newCategory == '')
				return " active";
		}
		if((newCategory == 'Tutorial') && (menuItem == 'Document' || 
			menuItem == 'Video' || menuItem == 'PopularQuestions'))
		{
				return " active";
		}

		if(newCategory == menuItem)
			return " active";
	}

	$scope.SignIn = function(){
		var username = $scope.username;
		if(username != null || username.length != 0)
		{
			$http.get('http://127.0.0.1:3000/user/' + username).then(function(res) {
				if(res.data.length != 0){
					var data = res.data[0];
					var password = $scope.password;
					console.log(data.status)
					if(data.status == 0){
						alert("Your account was blocked! Please contact administrator for more detail.");
					}
					else if (data.password != password){
						alert("You inputted wrong password....!");
					}
					else{
						var vipUser = -1;
						$http.get('http://127.0.0.1:3000/user/checkVip/' + data.user_id).then(function(res3){
							if(res3.data.length != 0){
								var data3 = res3.data[0];
								if(data3 != null){
									if(data3.user_id == data.user_id)
									{
										vipUser = 1;
									}
									else
										vipUser = -1;
								}
								else
									vipUser = -1;
							}

							$http.get('http://127.0.0.1:3000/image_user/' + data.user_id).then(function(res2){
								if(res2.data !=null  || res2.data.length != 0){
									var data2 = res2.data[0];
									var image2 = "";
									if(data2==null)
											image2  = "images/users/UnknownAvatar.jpg";
										else
											image2 = "images/users/" + data2.name;

									var InfoUser = {
										user_id : data.user_id,
										username : data.username,
										password : data.password,
										full_name : data.full_name,
										birthday : data.birthday,
										sex : data.sex,
										email : data.email,
										phone: data.phone,
										address: data.address,
										image: image2,
										vip_user: vipUser
									};
									if($scope.rememberPass == true){
										localStorage.setItem("username", username);
										localStorage.setItem("user_id", data.user_id);
										localStorage.setItem("type_user", data.type_user);
									}

									sessionStorage.setItem('InfoUser', JSON.stringify( InfoUser));
									sessionStorage.username = username;
									sessionStorage.user_id = data.user_id;
									sessionStorage.type_user = data.type_user;
									
									alert("Welcome " + username + " to Online Auction!");
									$scope.hideUsername = false;
									$scope.hideRegister = true;
									if(vipUser == 1)
										$scope.hideVipUser = false;
									else
										$scope.hideVipUser = true;

									$scope.username = username;

									if(data.type_user == "admin")
										$scope.hideAdminUser = false;
									else if(data.type_user == "user")
										$scope.hideAdminUser = true;

									//Check the number of products that user won to show message
									GetUserResult();
								}
							});
						});
						
					}
				}
				else
					alert("You inputted wrong username....!");
			});
		}
	}

	$scope.SignOut = function(){
		$scope.hideUsername = true;
		$scope.hideVipUser = true;
		$scope.hideRegister = false;
		$scope.hideAdminUser = true;

		sessionStorage.clear();
		localStorage.removeItem("username");
		localStorage.removeItem("user_id");
		localStorage.removeItem("type_user");

		var htmlLink = location.href;
		var newLink = "";
		if(htmlLink.indexOf("/username") != -1){
			newLink = '#All';
			$scope.SelectCategory('All');
		}

		$scope.signOut = newLink;
		$rootScope.$emit("LogOut", {});
	}

	function GetUserResult(){
		$http.get('http://127.0.0.1:3000/result').then(function(res) {
			var resultData;
			var count = 0;
			var username = sessionStorage.username;
	   		if(res.data != null)
	   		{
				resultData = res.data;
				for (var i = 0; i < resultData.length; i++) {
					if(resultData[i].was_delivered == 0 && resultData[i].winer_name == username)
						count++;
				}
	   		}

			if(count == 0)
   				$scope.cartLink = "";
			else
				$scope.cartLink = "#user_message/username=" + username;

	   		sessionStorage.numCart = count;
	   		$scope.numProduct = count;
		});

		$rootScope.isLoginForRating = true;
		$rootScope.isRated = false;
		var query = 'http://127.0.0.1:3000/rate/' + sessionStorage.curProID + '/' + sessionStorage.user_id;
		$http.get(query).then(function(res) {
			if(res.data.length != 0){
				var data = res.data[0].ratio;
				var star = "star-" + data;

				if(document.getElementById(star) != null)
					document.getElementById(star).checked = true;
				$rootScope.isRated = true;
			}
		});
	}
}]);
