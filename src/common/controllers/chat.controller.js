angular.module('allegra-chat-ctrl', [])
    .controller('ChatCtrl', function($scope, $http) {

        $scope.messages = [];

        $scope.sendMessage = function() {

            $scope.message.username = $scope.username;
            $scope.message.userId = $scope.userId;
           // console.log($scope.message);
            sock.send(JSON.stringify($scope.message));
            $scope.message = {};
        };

        $scope.login = function () {
          //  alert($scope.login.password);
           
           // document.cookie = "loggedin=true; expires=Thu, 18 Dec 2014 12:00:00 UTC";
           sock.send(JSON.stringify({method:'auth'}));
            $http({
                method: 'post',
                url: 'server/auth',
                 headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data:  $.param({
                    "username" : $scope.login.username,
                    "password" : $scope.login.password
                })
            }).then(function (response ) {
                 $scope.isLoggedIn = true;
                 console.log(response);
                 var data = response.data;

                 $scope.username = data.username;
                 $scope.timeLoggedIn = data.time;
                 $scope.userId = data.userId;

                document.cookie = "loggedin=true; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "token=" + data.authkey + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "loggedin-time="+ data.time + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "username="+data.username + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "userId="+data.userId + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";

               onLogin();
            }, function (erro ) {
                //donothing
                alert("Please try again");
            });
            
          //  console.log($rootScope.isLoggedIn);
        };
        
        var sock = new SockJS('http://localhost:1337/allegra-chat/chat');
        

        sock.onclose = function (e) {
            console.log('Disconnected');
        };

        sock.onmessage = function(e) {
            console.log(e.data);
            var data = $.parseJSON(e.data);

            console.log(typeof(data));
            
            if (Array.isArray(data)) {
                $scope.messages = data
            }
            else {
                $scope.messages.push(data);
            }
            
            $scope.$apply();
            var elem = document.getElementById('tableView');
            elem.scrollTop = elem.scrollHeight;  
        };
        sock.onerror = function (e) {
            console.log('error');
        };
        sock.onclose = function (e) {
            console.log('closed');
        };

        var getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return false;
        };

        var onLogin = function() {
            sock.send(JSON.stringify({method:'onLogin'}));
        };
        var mockLogin = function()
        {
            $scope.isLoggedIn = true;
            document.cookie = "loggedin=true; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "token=sldkru904; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "loggedin-time="+ Date.now + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "username=Taylor; expires=Thu, 18 Dec 2014 12:00:00 UTC";
                document.cookie = "userId=1; expires=Thu, 18 Dec 2014 12:00:00 UTC";
        };

        sock.onopen = function (e) {
            console.log('Connected to server');
           
            mockLogin();
           
            $scope.isLoggedIn = false;
            $scope.message = {};
            $scope.login = {};

            if(getCookie('loggedin') !== "") {
                $scope.isLoggedIn = getCookie('loggedin');
                onLogin();      
            }

            if (getCookie('username') !== "") {
                $scope.username = getCookie('username');
            }

            if (getCookie('userId') !== "") {
                $scope.userId = getCookie('userId');
            }
            $scope.$apply();
            console.log($scope.isLoggedIn);
        };

});