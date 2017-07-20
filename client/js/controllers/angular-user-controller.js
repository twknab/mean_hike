app.controller('userController', ['$scope', 'userFactory', '$location', '$routeParams', '$uibModal', '$log', function($scope, userFactory, $location, $routeParams, $uibModal, $log) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    var cb = {
        register: function(createdUser) {
            $scope.regErrors = '';
            $scope.newUser = {};
            $location.url('/dashboard');
        },
        login: function(foundUser) {
            $scope.loginErrors = {};
            $scope.user = {};
            $location.url('/dashboard');
        },
        loginError: function(err) {
            console.log('Errors returned from server:', err);
            $scope.loginErrors = {}; // resets errors if any already existing
            $scope.loginErrors = err;
        },
        regError: function(err) {
            console.log('Errors returned from server:', err);
            $scope.regErrors = {};
            $scope.regErrors = err;
        },
    };

    //--------------------------//
    //-------- NAVIGATION ------//
    //--------------------------//

    // Load Homepage:
    $scope.home = function() {
        $location.url('/');
    };

    // Load About Page:
    $scope.about = function() {
        $location.url('/about');
    };

    // Login User:
    $scope.login = function() {
        userFactory.login($scope.user, cb.login, cb.loginError);
    };


}]);

//---------------------------------------//
//-------- ANGULAR UI MODAL WINDOW ------//
//---------------------------------------//

angular.module('ui.bootstrap').controller('ModalDemoCtrl', function($uibModal, $log, $document) {
    var $ctrl = this;
    $ctrl.items = ['item1', 'item2', 'item3'];

    $ctrl.animationsEnabled = true;

    $ctrl.open = function(size, parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            //   backdrop: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '_register.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                items: function() {
                    return $ctrl.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $ctrl.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $ctrl.openComponentModal = function() {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            component: 'modalComponent',
            resolve: {
                items: function() {
                    return $ctrl.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $ctrl.selected = selectedItem;
        }, function() {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    };

    $ctrl.openMultipleModals = function() {
        $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: '_register.html',
            size: 'sm',
            controller: function($scope) {
                $scope.name = 'bottom';
            }
        });

        $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'stackedModal.html',
            size: 'sm',
            controller: function($scope) {
                $scope.name = 'top';
            }
        });
    };

    $ctrl.toggleAnimation = function() {
        $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
    };
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('ui.bootstrap').controller('ModalInstanceCtrl', function($uibModalInstance, items, $scope, userFactory, $location) {
     var $ctrl = this;
     // Callbacks
     var cb = {
         register: function(createdUser) {
             $scope.regErrors = '';
             $scope.newUser = {};
             $uibModalInstance.close();
             $location.url('/dashboard');
         },
         regError: function(err) {
             console.log('Errors returned from server:', err);
             $scope.regErrors = {};
             $scope.regErrors = err;
         },
     };

    $ctrl.register = function() {
        console.log("OK");
        console.log($scope.newUser);
        userFactory.register($scope.newUser, cb.register, cb.regError);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});

// Please note that the close and dismiss bindings are from $uibModalInstance.

angular.module('ui.bootstrap').component('modalComponent', {
    templateUrl: '_register.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function() {
        var $ctrl = this;

        $ctrl.$onInit = function() {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = {
                item: $ctrl.items[0]
            };
        };

        $ctrl.ok = function() {
            $ctrl.close({
                $value: $ctrl.selected.item
            });
        };

        $ctrl.cancel = function() {
            $ctrl.dismiss({
                $value: 'cancel'
            });
        };
    }
});
