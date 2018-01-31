'use strict';

angular.module('myEvents')
  .controller('MyEventsController', function($rootScope, $scope, $uibModal){
    this.header = 'My Events';
    this.events = $rootScope.currentUser.events;
    // var date = new Date();
    // this.myDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    this.today = new Date();
    // http://www.javasavvy.com/angularjs-modal-window-tutorial/
    this.addEvent = function() {
      $scope.modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myEvents/new-event-dialog.template.html',
        controller : ModelHandlerController,
        controllerAs: '$ctrl',
        size: 'lg',
        resolve: {
        
        }
      })
    };
    
    var ModelHandlerController = function($scope,$uibModalInstance){
      $scope.cancelModal = function(){
        console.log("cancelmodal");
        $uibModalInstance.dismiss('close');
      }
      $scope.ok = function(){
        $uibModalInstance.close('save');
        }
    };

  })
  .directive('myEvents', function () {
    return {
      restrict: 'E',
      templateUrl: 'myEvents/my-events.template.html',
      controller: 'MyEventsController',
      controllerAs: 'MyEventsController'
    };
  })
  