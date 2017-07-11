# Setup Directions:
1. `npm install`
2. `bower install`


# About:

This application is designed to help others plan and prepare for their hiking adventures, while also recording important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, basic questions about weather, distance, location and more will be asked, along with the ability
to create gear lists. This will ensure a more prepared mind when departing. Upon return, a "post-trip" form may be completed which will ask you important questions about the actual experience of your trip. Questions about actual experienced weather, actual hazards and more will help you log and retrospectively learn for better preparation next time.


## Future Feature Ideas / Improvements:

	+ Add a feature where the error message returned from the server (ie, `user`, or `password` in the error object)
	is passed through some conditional statement where then, that field becomes selected using a bootstrap field selection.
	This would be useful for the user so they're able to instantly see the field that flagged the error. Would be a nice cleaner
	way to show off error objects.

	+ Add a badge next to "Upcoming Hikes" which shows hike status (`pending` and `completed`)

	+ Add a feature where users can upload photos to each hike, a certain number and a certain file size.

	+ Add a feature where users can attach documents, such as a
	PDF map to their hike.

	+ Add a feature where users can share their hike report or pre-trip data with another (including map PDF attachments, for example).

	+ Add a feature where a google map / alternative map embed is placed
	into the hike.

	+ Add a buddy system where users can see other users and see their hikes. Messaging? (Everything these days must have a comment field eh...or must it...do we want people bickering and arguing? ...Maybe no messaging...)

## Development Issues Log:

### Where I Left Off:

	+ Finish User Login:
		- Add session for after registration and login.
		- Add login validation to check for email address in proper format.
		- Add login validation to ensure password
		is correct length.
		
