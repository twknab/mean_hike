# Setup Directions:
1. Git clone project.
2. `npm install` all packages.
3. `bower install` all packages.

# About:

This application is designed to help others plan and prepare for their hiking adventures, while also recording important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, basic questions about weather, distance, location and more will be asked, along with the ability to create gear lists. This will ensure a more prepared mind when departing. Upon return, a "post-trip" form may be completed which will ask you important questions about the actual experience of your trip. Questions about actual experienced weather, actual hazards and more will help you log and retrospectively learn for better preparation next time.

## Completed Improvements:

+ 8/08/17 - Secured API routes and Angular routes for valid session user only.
+ 8/07/17 - Cleaned up all methods and added descriptive commenting / doc string notation.
+ 8/01/17 - Added User Account Update feature and added User Messages.
+ 7/23/17 - Created separate `navController`, which handles all back-end navigation actions.
+ 7/22/17 - Moved bulk sum of User validations to Models file.
+ 7/21/17 - Added feature so username OR email allows for login validation.
+ 7/20/17 - Cleaned up modal controllers.
+ 7/19/17 - Added 'Never show this message again' setting to Dashboard Welcome Message.

## Wish List:

	+ Add a feature where validation errors display as bootstrap error form stylings in real-time. (medium-priority)

	+ Add a badge next to "Upcoming Hikes" which shows hike status (`pending` and `completed`) (low-priority)

	+ Add a feature where users can upload photos to each hike, a certain number and a certain file size. (medium-priority)

	+ Add a feature where users can attach documents, such as a
	PDF map to their hike. (medium-priority)

	+ Add a feature where users can share their hike report or pre-trip data with another (including map PDF attachments, for example). (medium-priority)

	+ Add a feature where a google map / alternative map embed is placed
	into the hike. (medium-priority)

	+ Add a buddy system where users can see other users and see their hikes. Messaging? (Everything these days must have a comment field eh...or must it...do we want people bickering and arguing? ...Maybe no messaging...) (low-priority)

	+ Add login validations where after 5 attempts account locks out for awhile. (medium-priority)

	+ Can you get a server log of user IP? (low-priority)

	+ Check for session with all important API routes, and send back to homepage if not valid (HIGH priority)

	+ (Later) Allow User to Delete their account (along with all the hikes, gear lists, and pre and post-trips that they own) (HIGH priority)

	+ Fix dashboard mobile issues -- buttons do not have margin/padding when collapsed (HIGH priority).

## Development Issues Log:

### Where I Left Off:
	- Add New Hike Feature:
		- Built $scope function in dashboardController, only partially. Created success and callback functions, but did not build out logic. Did not build out factory or any server controller methods yet. May need to get recent hikes list first, as you'll have to call this later.
		- Trying to build get most recent hikes feature first -- hitting a weird issue will troubleshoot in AM.
### Remaining Features:
	- Add Hike Feature
	- Edit Hike Feature
	- Add Pre-Trip Feature
	- Add Post-Trip Feature
	- Add Full Report Feature
	- Show Recent Hikes Feature
