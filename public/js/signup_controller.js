app.controller('SignUpController', ['$scope', '$http','$location', function($scope, $http, $location)  {
   $scope.CreateAccount=function(){
		var fullname=document.getElementById("fullname").value;
		var username=document.getElementById("username").value;
		var email=document.getElementById("email").value;
		var phone=document.getElementById("phonenumber").value;
		var address=document.getElementById("address").value;
		var password=document.getElementById("password").value;
		var confirm_password=document.getElementById("confirm_password").value;
		var gender;
		var day=document.getElementById("day").value;
		var month=document.getElementById("month").value;
		var year=document.getElementById("year").value;
		var success=true;

		//Check full name
		if(fullname=="")
		{
			$scope.errFullName = "Please input your full name!";
			success=false;
		}else if(fullname.length > 50){
			$scope.errFullName = "The length of 'Full Name' must less than 50";
			success=false;
		}
		else 
			$scope.errFullName = "";

		//Check username
		if(username=="")
		{
			$scope.errUsername = "Please input username!";
			success=false;
		}else if(username.length > 50){
			$scope.errUsername = "The length of 'Username' must less than 50";
			success=false;
		}else if(/^[a-zA-Z0-9- ]*$/.test(username) == false) {
		    $scope.errUsername = "Username must contain the letters from A-Z and 0-9";
		}
		else {
			$http.get('http://127.0.0.1:3000/user/' + username).then(function(res) {
				if(res.data.length != 0){
					$scope.errUsername = username + " existed";
					success= false;
				}
				else
					$scope.errUsername = "";
			});
		}

		//Check email
		if(email=="")
		{
			$scope.errEmail = "Please input your email!";
			success=false;
		}
		else if(email.length > 50){
			$scope.errEmail = "The length of 'Email' must less than 50";
			success=false;
		}
		else if(email.indexOf("@") == -1 || email.indexOf(".com") == -1){
			$scope.errEmail = "You inputted wrong email";
			success=false;
		}
		else
			$scope.errEmail = "";


		//Check phone
		if(phone=="")
		{
			$scope.errPhone = "Please input your phone!";
			success=false;
		}else if(phone.length > 12 || phone.length < 9 || isNaN(phone)){
			$scope.errPhone = "You inputted wrong phone";
			success=false;
		}
		else 
			$scope.errPhone = "";

		//Check address
		if(address=="")
		{
			$scope.errAddress= "Please input your address!";
			success=false;
		}else if(address.length > 100){
			$scope.errAddress = "The length of 'Address' must less than 100";
			success=false;
		}
		else 
			$scope.errAddress = "";

		//Check Password
		if(password=="")
		{
			$scope.errPassword= "Please input your password!";
			success=false;
		} else if(password.length < 6){
			$scope.errPassword= "The length of 'Password' must bigger than 5";
			success=false;
		}
		else if(confirm_password != password)
		{
			$scope.errPassword = "Password and Confirm Password don't match. Try again?";
			success= false;
		}
		else
			$scope.errPassword = "";
		
		//Get gender
		if(document.getElementById("female").checked==true)
			 gender="female";
		else
			 gender="male";


		if(success==true)
		{
			$http({
                url: 'http://127.0.0.1:3000/user/add',
                method: 'POST',
                data: {
                	'username': username,
                    'password': password,
                    'fullname': fullname,
                    'gender': gender,
                    'birthday': year+"-"+month+"-"+day,
                    'phone': phone,
                    'email': email,
                    'address': address,
                    'type_user': "user"
            }
	        }).then(function(res) {
	        	$location.path("#/");
	        	alert("Congratulation! Your new account has been created");
	        });
		}
 	}
}]);