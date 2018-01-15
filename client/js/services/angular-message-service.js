app.service('userMessages', function() {

  // Create an empty alerts arry to hold alerts:
  var alerts = [];

  return {
    getAlerts: function() {
      /*
      Returns all current alerts.
      */

      return alerts;
    },
    addAlert: function(alert) {
      /*
      Adds a new alert to the alerts array, then returns alerts.
      */

      alerts.push(alert);
      return alerts;
    },
    clearAlerts: function() {
      /*
      Resets all alerts by setting alerts variable to an empty array.
      */

      alerts = [];
      return alerts;
    },
    removeAlert: function(index) {
      /*
      Remove an alert from alerts array and return alerts.
      */

      alerts.splice(index, 1); // removes message from alert array
      return alerts;
    },
  };

});
