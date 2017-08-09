app.controller('userController', ['$scope', 'userFactory', 'userMessages', '$location', '$routeParams', '$uibModal', '$log', function($scope, userFactory, userMessages, $location, $routeParams, $uibModal, $log) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    /*
    The callback functions below only runs if one of the $scope methods below utilizes a factory method. The callback is sent to the factory, and will run after the factory receives a response from the server API. Please see individual callback functions for how each work.
    */
    var cb = {
        // Runs after $scope.login() function completes:
        login: function(foundUser) {
            $scope.loginErrors = {};
            $scope.user = {};
            $location.url('/dashboard');
        },
        // Runs if errors after $scope.login() function completes:
        loginError: function(err) {
            console.log('Errors returned from server:', err);
            // Reset any existing alerts
            $scope.successAlerts = userMessages.clearAlerts();
            $scope.loginErrors = {}; // resets errors if any already existing
            $scope.loginErrors = err;
        },
    };

    //----------------------//
    //-------- ALERTS ------//
    //----------------------//

    // Update any alert messages:
    $scope.successAlerts = userMessages.getAlerts();

    // Close Success Alert:
    $scope.closeSuccessAlert = function(index) {
        // Run service to remove alert and update data binding:
        $scope.successAlerts = userMessages.removeAlert(index);
    };

    //--------------------------//
    //-------- NAVIGATION ------//
    //--------------------------//

    // Loads Homepage:
    $scope.home = function() {
        $location.url('/');
    };

    // Loads About Page:
    $scope.about = function() {
        $location.url('/about');
    };

    // Login Existing User:
    $scope.login = function() {
        userFactory.login($scope.user, cb.login, cb.loginError);
    };


}]);

//--------------------------------------//
//-------- ANGULAR UI MODAL SETUP ------//
//--------------------------------------//
// Create an angular controller to handle the setup of our Modal:
angular.module('ui.bootstrap').controller('ModalRegisterCtrl', function($uibModal, $log, $document) {
    // Set `this` as the variable `$ctrl`, to access our controller instance:
    var $ctrl = this;

    // Turns on Modal Animations:
    $ctrl.animationsEnabled = true;

    // Defines Properties of New Modal Window:
    $ctrl.open = function(parentSelector) {
        var parentElem = parentSelector ?
            // Gives us parent of `.modal-demo` so we can append our Modal to parent -- at least, I believe this is what's going on... =)
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            //   backdrop: false,  // turn off backdrop (known ang-ui bootstrap modal bug)
            ariaLabelledBy: 'modal-title', // modal title HTML
            ariaDescribedBy: 'modal-body', // modal body HTML
            templateUrl: '_register.html', // the HTML data itself that will be loaded into Modal
            controller: 'ModalInstanceCtrl', // links us to the controller for our Modal
            controllerAs: '$ctrl', // shorthand notation for our controller
            size: 'lg', // sets modal to Large size
            appendTo: parentElem, // appends our Modal to the parent element above
        });

        // Runs after modal window is closed:
        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

//------------------------------------------//
//-------- ANGULAR UI MODAL FUNCTIONS ------//
//------------------------------------------//
//--- this is the stuff the modal can do ---//
//------------------------------------------//
// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
// Create an angular controller to handle the functions our Modal should perform:
angular.module('ui.bootstrap').controller('ModalInstanceCtrl', function($uibModalInstance, $scope, userFactory, $location) {

    // Gives us easy access to our instance by capturing `this` as `$ctrl`:
     var $ctrl = this;

     // Callbacks
     var cb = {
         // Runs after $ctrl.register() finishes:
         register: function(createdUser) {
             $scope.regErrors = '';
             $scope.newUser = {};
             $uibModalInstance.close();
             $location.url('/dashboard');
         },
         // Runs if registration errors after $ctrl.register():
         regError: function(err) {
             console.log('Errors returned from server:', err);
             $scope.regErrors = {};
             $scope.regErrors = err;
         },
     };

    // Registers new user:
    $ctrl.register = function() {
        console.log("Attemping to register new user...");
        console.log("Data submitted:", $scope.newUser);
        userFactory.register($scope.newUser, cb.register, cb.regError);
    };

    // Cancels registration and closes Modal window:
    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
