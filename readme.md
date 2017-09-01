# Setup Directions:
1. Git clone project.
2. `npm install` all packages.
3. `bower install` all packages.

# About:

This application is designed to help others plan and prepare for their hiking adventures, while also recording important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, basic questions about weather, distance, location and more will be asked, along with the ability to create gear lists. This will ensure a more prepared mind when departing. Upon return, a "post-trip" form may be completed which will ask you important questions about the actual experience of your trip. Questions about actual experienced weather, actual hazards and more will help you log and retrospectively learn for better preparation next time.

## Completed Improvements:

+ 9/01/17 - Stats feature added.
+ 8/31/17 - Delete Hike, Delete Post-Trip, Delete Pre-Trip features added.
+ 8/30/17 - Edit Hike, Edit Post-Trip, Edit Pre-Trip features added.
+ 8/28/17 - PostTrip feature with validations added.
+ 8/27/17 - View Hike feature added.
+ 8/27/17 - All Hikes feature and Search added.
+ 8/26/17 - PreTrip feature with validations added.
+ 8/17/17 - Add New Hike feature completed with Validations.
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

	+ Add a feature where users can upload photos to each hike, a certain number and a certain file size. (medium-priority) -- Not sure about this one as it will eat up server space and increase AWS $$$$.

	+ Add a feature where users can attach documents, such as a
	PDF map to their hike. (medium-priority) -- Not sure about this one as it will eat up server space and increase AWS $$$$.

	+ Input body metrics -- smartwatch data -- to post-trip (low-priority)

	+ Add ability to add multi-day to hike pre-trip (low-priority)

	+ Add meal plan feature (low-priority)

	+ Add a feature where users can share their hike report or pre-trip data with another (including map PDF attachments, for example). (medium-priority)

	+ Add a feature where a google map / alternative map embed is placed
	into the hike. (medium-priority)

	+ Add a buddy system where users can see other users and see their hikes. Messaging? (Everything these days must have a comment field eh...or must it...do we want people bickering and arguing? ...Maybe no messaging...) (low-priority)

	+ Add login validations where after 5 attempts account locks out for awhile. (medium-priority)

	+ Can you get a server log of user IP? (low-priority)

	+ Check for session with all important API routes , and send back to homepage if not valid (HIGH priority)

	+ Regex patterns work for non-english names and places.

	+ (Later) Allow User to Delete their account (along with all the hikes, gear lists, and pre and post-trips that they own) (HIGH priority)

	+ Fix dashboard mobile issues -- buttons do not have margin/padding when collapsed (HIGH priority).

	+ Add gear list feature (high-priority)

	+ Change "Recent Hikes" to "Hikes Pending" showing any hikes still awaiting a post-trip report. This might be helpful as a user whom adds many hikes may lose track of any hikes they started, but came home and forgot to complete. See what use experience is like and play around a bit. (medium-priority)

	+ Setup other error messages to also utilize services (like PreTrip creation does), so that you can use `$autoScroll()` more.

	- Change Angular Controller Auth fail to use a service instead of duplicate code.

	+ Add the nav header page code as separate HTML includes (medium-priority)

	+ Add Progress Bar to Add Hike, Pre-Trip and Post-Trip pages (See: https://bootswatch.com/darkly/#typography)

	+ Add autoScroll so after dashboard navigation items are clicked, page is scrolled to that accordion. (high-priority)

	+ Add `Add Hike` button to top and bottom accordion panes, so when clicked, opens the `+ Hike` accordion (and maybe even selects [ie, focus] the first field...) (high-priority)

	+ Turn Hike View page panes into Accordions like on Dashboard page (high-priority)

	+ Add `+ Post-Trip` to nav menu (high-priority)

	+ Setup user edit page and add hike page, etc, to also utilize messages service like you ended up doing on post-trip, pre-trip and edit hike pages...(use alerts universally across the app) (medium-priority)

	+ Add validation that Location URL must contain "http://" (high priority)

	- Delete User Account Feature -- Thursday (if Time) (high priority)

## Development Issues Log:
	- `$autoScroll()` re-renders DOM and re-executes Controller.
	- When using `ngRoute`, `res.redirect('/')` does not change view.
	- How do I delete a property from a Mongoose Object server-side, not in Angular (ie, password security)?

### Where I Left Off:


### Remaining Features:
	- Mobile responsiveness - Friday
		-- Still some anchor scrolling bugs...
	- Clear out current DB entries...
	- Launch and Deploy -- Friday
	- Setup `hiking.tools` URL -- Friday
	- Create licensing document for GitHub -- Friday

### Things to Consider After Features Built:


	- Clear out all of your console log messages (which can be revealing)
