angular.module('allegra-chat', [])
    .controller('ChatCtrl', function($scope, $http) {

        var host = location.origin.replace(/^http/, 'ws');
        console.log(host);
        var sock = new WebSocket(host);
        $scope.messages = [];
        $scope.isLoading = true;
        $scope.login = {};
        $scope.sendMessage = function() {

            $scope.message.username = $scope.username;
            $scope.message.userId = $scope.userId;
           // console.log($scope.message);
            sock.send(JSON.stringify($scope.message));
            $scope.message = {};
        };

        var onAuth = function(response) {
            $scope.isLoggedIn = true;
            console.log(response);
            var data = response;

            $scope.username = data.username;
            $scope.timeLoggedIn = data.time;
            $scope.userId = data.userId;

            document.cookie = "loggedin=true; expires=Thu, 18 Dec 2014 12:00:00 UTC";
           
            document.cookie = "loggedin-time="+ data.time + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";
            document.cookie = "username="+ data.username + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";
            document.cookie = "userId="+data._id + "; expires=Thu, 18 Dec 2014 12:00:00 UTC";

           onLogin();
        };

        $scope.login = function () {
         
           sock.send(
            JSON.stringify({
                method:'auth', 
                body: {
                    username: $scope.login.username, 
                    password: $scope.login.password
                }
            }
            ));
        };
        
        sock.onclose = function (e) {

            console.log('Disconnected');
        };

        sock.onmessage = function(e) {
            console.log(e.data);
            var sData = e.data.replace(
                /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g,
                '<a href="$1">$1</a>'
            );

            console.log(sData);
            var data = $.parseJSON(e.data);

            console.log(typeof(data));
            
            if (data.auth && data.auth === true) {
                onAuth(data);
            } 

            else { 
                if (Array.isArray(data)) {
                    $scope.messages = data
                }
                else {
                    $scope.messages.push(data);
                }
                
                $scope.$apply();
                var elem = document.getElementById('tableView');
                elem.scrollTop = elem.scrollHeight;  
            }
             $scope.$apply();
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
           
           // mockLogin();
           
            $scope.isLoggedIn = false;
            $scope.isLoading = false;
            $scope.message = {};
            

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