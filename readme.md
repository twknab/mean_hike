# Setup Directions:
1. `npm install`
2. `bower install`


# About:

This application is designed to help others plan and prepare for their hiking adventures, while also recording important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, basic questions about weather, distance, location and more will be asked, along with the ability
to create gear lists. This will ensure a more prepared mind when departing. Upon return, a "post-trip" form may be completed which will ask you important questions about the actual experience of your trip. Questions about actual experienced weather, actual hazards and more will help you log and retrospectively learn for better preparation next time.

## Completed Improvements:
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

	+ Can you get a server log of user IP? (low-priority)

	+ Check for session with all important API routes, and send back to homepage if not valid (high-priority)



## Development Issues Log:


### Where I Left Off:

	- Build edit user page that allows user to change their email (as long as not already taken), change their password, and to delete their account (if they wish, along with all the hikes, gear lists, and pre and post-trips that they own) -- maybe do this AFTER you've built all your models to better know all the bases you have to cover. Right now, we've only built our user model and you may not totally understand your database design yet. Maybe make an ERD before this. OR: Just add basic user changes for now, and then add in DELETE function after you've mostly built rest of features.

		# THIS IS WHAT YOU MUST DO #
		- Realized that I may need to build a navigation-specific controller.
		- This controller will hold all important navigation tasks.
		- This controller will only be linked to important dashboard-side actions.
		- You will use ng-controller="navController" to pass this into every navbar you want to work.
		- This will check for a valid session

		# Here's what I just did:
			- made a nav controller which:
				- checks for session
				- holds all imporant logged-in user nav functions

		# Here's my confusion:
			- Technically your api routes are still open to non-session users
			- What would be the best way to handle securing each route, by checking for session? (like you were doing in Python...)
