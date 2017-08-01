app.service('userMessages', function () {

    var alerts = [];

    return {
        getAlerts: function() {
            return alerts;
        },
        addAlert: function(alert) {
            alerts.push(alert);
            return alerts;
        },
        clearAlerts: function() {
            // Set to empty object (to reset list):
            alerts = [];
            return alerts;
        },
        removeAlert: function(index) {
            alerts.splice(index, 1); // removes message from alert array
            return alerts;
        },
    };

});
