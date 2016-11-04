(function() {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController)
        .controller('TestController', TestController)
        .controller('DataController', DataController);


    ChatController.$inject = ['$state', '$http', '$localStorage', 'socket'];
    function ChatController ($state, $http,  $localStorage, socket) {
        var vm = this;
        vm.messages  = [];
        vm.text = '';
        vm.sendMsg  = sendMsg;

        joinChat();
        onNewUser();

        function joinChat() {

            if ($localStorage.currentUser) {
                socket.emit('user_join', $localStorage.currentUser.username);
            } else {
                return false;
            }
        }

        function onNewUser() {
            socket.on('new_user_join', function (data) {
                console.log('new_user');
                console.log(data);
            });
        }

        function sendMsg() {
            socket.emit('send_message', vm.text);
            vm.messages.push({username: $localStorage.currentUser.username, text: vm.text});
            vm.text = '';
        };
        socket.on('receive_message', function(data) {
            console.log(data);
            vm.messages.push(data);
        })

    }

    TestController.$inject = ['ShareService'];
    function TestController(ShareService) {
        var vm = this;
        vm.data = ShareService.data;
    }


    DataController.$inject = ['ShareService'];
    function DataController (ShareService) {
        var vm = this;
        vm.data = ShareService.data;

        vm.update = updateData;

        function updateData() {
            ShareService.update({fistname: 'Nguyen Quoc ', lastname:  'Dat'});
        }
    }

})();