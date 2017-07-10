#Setup Directions:
1. `npm install`
2. `bower install`


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

	+ User registration complete with P/W hashing and comparison methods completed.
	+ Keep testing strong password generator. So far seems OK but seen a few bugs.
	+ **ISSUES**: Currently, when Modal window closes, the close does work, but the `$location.url` does not work
		unless it's moved outside of the `.on()` event listener. I posted to stackoverflow to see if I can find a
		solution. People seem to recognize **angular-ui** which you might want to look into and see how you
		can integrate your angular with bootstrap more smoothly, and if this would give you the solution you needed.
		Maybe here you will find your answers:
			+ http://angular-ui.github.io/bootstrap/
			+ http://stackoverflow.com/questions/27470697/how-to-close-bootstrap-modal-window-from-angularjs


	+ angular-ui:
		- The reason the modal windows are not working is because the proper way
		to integrate Boostrap into Angular is with 'angular-ui'. Since angular has
		its own way of manipulating the DOM, you cannot incorporate jQuery without
		getting some bugs or ghetto rigging it. Thus, what we have to do is incorporate angular-ui.

		- So far I have:
			- Grabbed bootstrap css
			- Installed angular, angular-touch and angular-animate

		- Still need to install directives and setup module:
			- See this link: https://angular-ui.github.io/bootstrap/
