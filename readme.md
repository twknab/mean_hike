# Setup Directions:
1. `npm install`
2. `bower install`


# About:

This application is designed to help others plan and prepare for their hiking adventures, while also recording important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, basic questions about weather, distance, location and more will be asked, along with the ability
to create gear lists. This will ensure a more prepared mind when departing. Upon return, a "post-trip" form may be completed which will ask you important questions about the actual experience of your trip. Questions about actual experienced weather, actual hazards and more will help you log and retrospectively learn for better preparation next time.

## Completed Improvements:

+ 7/23/17 - Created separate `navController`, which handles all back-end navigation actions.
+ 7/22/17 - Moved bulk sum of User validations to Models file.
+ 7/21/17 - Added feature so username OR email allows for login validation.
+ 7/20/17 - Cleaned up modal controllers.
+ 7/19/17 - Added 'Never show this message again' setting to Dashboard Welcome Message.

## Future Feature Ideas / Improvements:

	+ Add a feature where the error message returned from the server (ie, `user`, or `password` in the error object) is passed through some conditional statement where then, that field becomes selected using a bootstrap field selection. This would be useful for the user so they're able to instantly see the field that flagged the error. Would be a nice cleaner way to show off error objects. Basically this allows fields that need to be fixed to be highlighted. (medium-priority)

	+ Add a badge next to "Upcoming Hikes" which shows hike status (`pending` and `completed`) (low-priority)

	+ Add a feature where users can upload photos to each hike, a certain number and a certain file size. (high-priority)

	+ Add a feature where users can attach documents, such as a
	PDF map to their hike. (medium-priority)

	+ Add a feature where users can share their hike report or pre-trip data with another (including map PDF attachments, for example). (medium-priority)

	+ Add a feature where a google map / alternative map embed is placed
	into the hike. (high-priority)

	+ Add a buddy system where users can see other users and see their hikes. Messaging? (Everything these days must have a comment field eh...or must it...do we want people bickering and arguing? ...Maybe no messaging...) (low-priority)

	+ Add login validations where after 5 attempts account locks out for awhile. (medium-priority)

	+ Add feature where if user name ends with `s` (but preserve the apostrophe), that the apostrophes on the Account page and Dashboard page (which use the username in plural sense), is removed, so that the language is proper english (low-priority).

	+ Can you get a server log of user IP? (low-priority)

	+ Check for session with all important API routes, and send back to homepage if not valid (high-priority)

	+ Change the way that error messages are generated in our model instance methods. Right now, you have to do some comparison in your server controller, to detect the difference between errors returned from built-in validators VS your custom instance methods. This just adds an extra layer of complexity to your server controller and you may be better suited just formatting it all on the back-end, and handing back a nice clean list to iterate through simply. This stuff just makes things more confusing, but understand you took the approach you did as it was a solution at the time. We can improve this solution now that we understand the problem from a greater context. (low-to-medium priority)



## Development Issues Log:


### Where I Left Off:		

	Unfortunately, your validations are very sloppy. Here's what I want you to do:

		- Rework your checkDuplicates function so that it accepts a callback, and runs that callback when it completes.

		- Re-arrange your login and registration controller functions, so that you don't need the validation module, and instead, do all of your validations right in the single file of the user-controller.js.

		- Change up your errors that you generate in your model, so that they match the default validation style. Then you can simplify how you return errors to your factory within your controller.

		- The reason I want you to do these things, is that they'll make the rest of your project easier. Getting these validations down tight for registration, login and user update, will ensure that your future validations for other parts of your project are also strong.

		- (Later) Delete their account (along with all the hikes, gear lists, and pre and post-trips that they own)
			- Maybe do this AFTER you've built all your models to better know all the bases you have to cover.

	- Secure your Authorize Function:

		+ There might be a security risk in your authorize function. Think of it this way: right now, you packaged that into your navbar. What if someone downloads your HTML and tries to use your code, but just chops out the navbar code? Because all the other controller functions on each page will run, without any auth (because they are assuming the navController will take care of that), it means a person could query data if the naBar wasn't present. So my suggestion is to go back to your original strategy: for each Controller, build an auth function that queries for auth status (you should not have to rebuild your server side controller, just your angular controller). Then, ANY controller that runs, will automatically authorize your user, even if the navbar was removed -- and no core content could be obtained, as the other queries ONLY run after things have been authorized. **OR if you can find a way to secure them in the backend, then you won't have to do this -- as any query at all to those functions would require a valid session....you might have to think this one out....**


	- Secure your API Routes:

		+ Technically your api routes are still open to non-session users
		+ What would be the best way to handle securing each route, by checking for session? (like you were doing in Python...)  [IDEA: What about using something in your middleware to check for a sesssion?] (maybe just if no session send 404, although we can do better.)
