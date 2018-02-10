'use strict';

angular.module('myEvents')
  .controller('MyEventsController', function ($rootScope, $scope, $uibModal) {
    var vm = this;
    vm.header = 'My Events';
    vm.events = $rootScope.currentUser.events;
    // var date = new Date();
    // this.myDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

    // http://www.javasavvy.com/angularjs-modal-window-tutorial/
    // https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs
    // https://stackoverflow.com/questions/20286445/how-do-i-prevent-angular-ui-modal-from-closing
    // https://github.com/rwaltenberg/angular-money-mask
    // https://stackoverflow.com/questions/13602039/e-srcelement-is-undefined-in-firefox
    vm.addEvent = function () {
      vm.modalInstance = $uibModal.open({
        backdrop: 'static',
        keyboard: false,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'my-events/new-event-dialog.template.html',
        controller: ModelHandlerController,
        controllerAs: 'ModelHandlerController',
        size: 'lg',
        resolve: {

        }
      })
    };

    var ModelHandlerController = function ($scope, $rootScope, $uibModalInstance, localStorageService) {
      var vm = this;
      vm.today = new Date();
      vm.selectedDate = '';
      vm.price = '';
      vm.selectedUser = '';
      vm.selectedUsers = [];
      vm.users = $rootScope.registeredUsers.slice(0);
      vm.newEvent;
      // this.myDate = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
      vm.add = function () {
        if(vm.selectedUser.name === '' || vm.selectedUser.name == undefined){
          return;
        }
        for(var i = 0; i < vm.selectedUsers.length; i++) {
          if(vm.selectedUsers[i] === vm.selectedUser.name) {
            return;
          }
        }
        vm.selectedUsers.push(vm.selectedUser.name);
      };
      vm.remove = function (addedUser) {
        for(var i = 0; i < vm.selectedUsers.length; i++) {
          if(vm.selectedUsers[i] === addedUser) {
            vm.selectedUsers.splice(i,1);
          }
        }
      };
      vm.cancelModal = function () {
        // console.log("cancelmodal", vm.selectedDate, vm.price);
        $uibModalInstance.dismiss('close');
      };
      vm.ok = function () {
        console.log("OK", vm.selectedDate, vm.price, vm.selectedUser);
        vm.newEvent = {
          date: ''+vm.selectedDate,
          price: vm.price,
          participants: vm.selectedUsers
        };
        $rootScope.currentUser.events.push(vm.newEvent);
        localStorageService.set($rootScope.currentUser.id, $rootScope.currentUser);
        $uibModalInstance.close('save');
      };
      vm.isInvalid = function () {
        if(vm.selectedUsers.length === 0 || vm.selectedDate === '' || vm.selectedDate == undefined) {
          return true;
        } else {
          return false;
        }
      };
    };

  })
  .directive('myEvents', function () {
    return {
      restrict: 'E',
      templateUrl: 'my-events/my-events.template.html',
      controller: 'MyEventsController',
      controllerAs: 'MyEventsController'
    };
  })
