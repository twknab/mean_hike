# Setup Directions:
1. `npm install`
2. `bower install`


# About:

This application is designed to help others plan and prepare for their hiking adventures, while also recording important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, basic questions about weather, distance, location and more will be asked, along with the ability
to create gear lists. This will ensure a more prepared mind when departing. Upon return, a "post-trip" form may be completed which will ask you important questions about the actual experience of your trip. Questions about actual experienced weather, actual hazards and more will help you log and retrospectively learn for better preparation next time.

## Completed Improvements:
	- 7/20/17 - Cleaned up modal controllers.
	- 7/19/17 - Added 'Never show this message again' setting to Dashboard Welcome Message.

## Future Feature Ideas / Improvements:

	+ Add a feature where the error message returned from the server (ie, `user`, or `password` in the error object) is passed through some conditional statement where then, that field becomes selected using a bootstrap field selection. This would be useful for the user so they're able to instantly see the field that flagged the error. Would be a nice cleaner way to show off error objects. Basically this allows fields that need to be fixed to be highlighted.

	+ Add a badge next to "Upcoming Hikes" which shows hike status (`pending` and `completed`)

	+ Add a feature where users can upload photos to each hike, a certain number and a certain file size.

	+ Add a feature where users can attach documents, such as a
	PDF map to their hike.

	+ Add a feature where users can share their hike report or pre-trip data with another (including map PDF attachments, for example).

	+ Add a feature where a google map / alternative map embed is placed
	into the hike.

	+ Add a buddy system where users can see other users and see their hikes. Messaging? (Everything these days must have a comment field eh...or must it...do we want people bickering and arguing? ...Maybe no messaging...)

	+ Add login validations where after 5 attempts account locks out for awhile.

	+ (can you get a server log of an IP?)

	+ Login: if email address is used rather than username, display message saying they need to use their username, not their email (or accept either a username or email -- this is the ideal functionality and common in many web applications)...


## Development Issues Log:

### Where I Left Off:

	+ Finish User Login:
		- Add session for after registration and login.
		- Add login validation to check for email address in proper format.
		- Add login validation to ensure password
		is correct length.

### Where I Left Off:
	- Build edit user page that allows user to change their email (as long as not already taken), change their password, and to delete their account (if they wish, along with all the hikes that they own)
