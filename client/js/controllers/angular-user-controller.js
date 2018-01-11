app.controller('userController', ['$scope', 'userFactory', 'userMessages', '$location', '$routeParams', '$uibModal', '$log', '$window', '$anchorScroll', function($scope, userFactory, userMessages, $location, $routeParams, $uibModal, $log, $window, $anchorScroll) {

  //----------------------------------//
  //-------- CALLBACK FUNCTIONS ------//
  //----------------------------------//
  /*
  The callback functions below only runs if one of the $scope methods below utilizes a factory method. The callback is sent to the factory, and will run after the factory receives a response from the server API. Please see individual callback functions for how each work.
  */
  var cb = {
    login: function(foundUser) {
      /*
      Runs after `$scope.login()` function completes.

      Parameters:
      - `foundUser` - User object returned.
      */

      $scope.loginErrors = {};
      $scope.user = {};
      userMessages.clearAlerts();
      $location.url('/dashboard');
    },
    loginError: function(err) {
      /*
      Runs if errors after $scope.login() function completes.

      Parameters:
      - `err` - Login errors returned.
      */

      // Reset any existing alerts
      $scope.successAlerts = userMessages.clearAlerts();

      // Add error class to any field who was returned with error:
      for (var key in err) {
        if (err.hasOwnProperty(key)) {

          // Uses jQlite (built-in) to grab DOM element and add a class:
          angular.element(document.querySelector('#' + key)).addClass('is-invalid').parent().after("<p class='margin-left-xsm err-msg'>" + err[key].message + "</p>");

        }
      };

      $scope.scrollTo('top-login');
    },
  };

  //----------------------//
  //-------- ALERTS ------//
  //----------------------//

  // Update any alert messages:
  $scope.successAlerts = userMessages.getAlerts();

  $scope.closeSuccessAlert = function(index) {
    /*
    Close a success alert.

    Parameters:
    - `index` - Index value for alert to remove.
    */

    // Run service to remove alert and update data binding:
    $scope.successAlerts = userMessages.removeAlert(index);
  };

  //-----------------------//
  //-------- ACTIONS ------//
  //-----------------------//

  $scope.home = function() {
    /*
    Loads homepage.
    */

    $location.url('/');
    $scope.scrollTo('top');
  };

  $scope.about = function() {
    /*
    Loads about page.
    */

    $location.url('/about');
    $scope.scrollTo('top');
  };

  $scope.login = function() {
    /*
    Login an existing user.
    */

    // Clear out any `is-invalid` error classes already existing from past submissions.
    // Note: This seems really ugly to me, and please, if you're reading this, help me find a more elegant solution! Help me! ☹️
    angular.element(document.querySelector('#addHikeForm')).children().children().removeClass('is-invalid');

    // Remove all error messages beneath flagged input fields:
    angular.element(document.querySelectorAll('.err-msg')).remove();

    userFactory.login($scope.user, cb.login, cb.loginError);
  };

  $scope.scrollLogin = function() {
    /*
    Scrolls to login page.
    */

    $location.url('/');
    $scope.scrollTo('top-login');
  };

  $scope.timHome = function() {
    /*
    Loads Tim's homepage.
    */

    $window.open('http://sasquat.ch', "_blank");
  };

  $scope.contact = function() {
    /*
    Loads personal contact page
    */

    $window.open('http://sasquatchcreative.com/contact/', "_blank");
  };

  //------------------------------//
  //------- ANCHOR SCROLL  -------//
  //------------------------------//

  $scope.scrollTo = function(htmlId) {
    /*
    Scrolls to an #id for an HTML element which is supplied.

    Parameters:
    - `htmlId` - HTML ID of element to scroll to.
    */

    $anchorScroll(htmlId);
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
    modalInstance.result.then(function() {}, function() {
      // $log.info('Modal dismissed at: ' + new Date());
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
angular.module('ui.bootstrap').controller('ModalInstanceCtrl', function($uibModalInstance, $scope, userFactory, $location, $anchorScroll) {

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
      $scope.regErrors = {};
      $scope.regErrors = err;

      // Add error class to any field who was returned with error:
      for (var key in err) {
        if (err.hasOwnProperty(key)) {

          // Uses jQlite (built-in) to grab DOM element and add a class:
          angular.element(document.querySelector('#' + key)).addClass('is-invalid').parent().after("<p class='margin-left-xsm err-msg'>" + err[key].message + "</p>");

        }
      };
      $ctrl.scrollTo('top-registration');
    },
  };

  // Registers new user:
  $ctrl.register = function() {
    // Clear out any `is-invalid` error classes already existing from past submissions.
    // Note: This seems really ugly to me, and please, if you're reading this, help me find a more elegant solution! Help me! ☹️
    angular.element(document.querySelector('#registrationForm')).children().children().children().removeClass('is-invalid');

    // Remove all error messages beneath flagged input fields:
    angular.element(document.querySelectorAll('.err-msg')).remove();

    userFactory.register($scope.newUser, cb.register, cb.regError);
  };

  // Cancels registration and closes Modal window:
  $ctrl.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  //------------------------------//
  //------- ANCHOR SCROLL  -------//
  //------------------------------//

  $ctrl.scrollTo = function(htmlId) {
    /*
    Scrolls to an #id for an HTML element which is supplied.

    Parameters:
    - `htmlId` - HTML ID of element to scroll to.
    */

    $anchorScroll(htmlId);
  };
});
