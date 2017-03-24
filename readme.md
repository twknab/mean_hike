#Setup Directions:
1. `npm install`
2. `bower install`
3. Edit `/bower_components/bootstrap/bootstrap.less`
	+ Add to the bottom of the file:
		`// Addons
		@import "./../../client/css/tk-customizations.less";`
	+ This will pull in the customization less file
4. `npm install -g grunt-cli`
5. Navigate to `/bower_components/bootstrap` folder
6.`grunt dist` to have grunt re-compile less files


###Development Issues Log:

1. Why won't my bootstrap `alert-dismissable` class not take?:

	+ If I follow the instructions from this page: https://www.w3schools.com/bootstrap/bootstrap_alerts.asp,
	I am still unable to get my alerts (like the info one on the home page) to properly respond to a close action.

	####Solution:



###Future Feature Ideas/Improvements:

	+ Add a feature where the error message returned from the server (ie, `user`, or `password` in the error object)
	is passed through some conditional statement where then, that field becomes selected using a bootstrap field selection.
	This would be useful for the user so they're able to instantly see the field that flagged the error. Would be a nice cleaner
	way to show off error objects.

	+ Add a badge next to "Upcoming Hikes" which shows hike status (`pending` and `completed`)


###Where I Left Off:

	+ Tried to convert /dashboard page to accordians, but was hitting issue with angular-routing and bootstrap.
	See this link here: http://stackoverflow.com/questions/18803955/angularjs-with-bootstrap-3-accordion-not-working-when-included-via-ng-view
