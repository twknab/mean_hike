
# About HikingTool

- [About HikingTool](#about-hikingtool)
  - [Live Deployment](#live-deployment)
  - [Screenshots](#screenshots)
  - [Technologies](#technologies)
  - [Setup Instructions](#setup-instructions)
  - [Features](#features)
  - [Completed Improvements](#completed-improvements)
  - [Dugout (Next Feature)](#dugout-next-feature)
  - [Future Features Wish List](#future-features-wish-list)
  - [Important Needed Features](#important-needed-features)
  - [Important Bugs](#important-bugs)
  - [Developer Note](#developer-note)

HikingTool is a JavaScript based application designed to help others plan and prepare for their hiking adventures. Users can record important information from their experience that may be of value for future hikes. By filling out a "pre-trip" form prior to departing, which includes basic questions about weather, distance and location, users are better prepared for their pending trip. Upon return, a "post-trip" form may be completed which will ask important questions about the actual experiences from the user's trip. Preparing beforehand, and retrospectively learning, will help users become more skillful and safer hikers.

## Live Deployment

You can see a live deployment of HikingTool at:

- [https://hiking.tools](https://hiking.tools)

## Screenshots

*1. Login*
![login](https://user-images.githubusercontent.com/20636750/108612698-f0178680-739f-11eb-8c9a-2ddc05245d71.png)

*2. Register*
![register](https://user-images.githubusercontent.com/20636750/108612699-f0b01d00-739f-11eb-80e9-a177cf331b73.png)

*3. About*
![about](https://user-images.githubusercontent.com/20636750/108612700-f148b380-739f-11eb-8876-9174501d91d3.png)

*4. Dashboard*
![dashboard](https://user-images.githubusercontent.com/20636750/108612701-f148b380-739f-11eb-98f8-bd0e2a0afa79.png)

*5. Add New Hike*
![add-hike](https://user-images.githubusercontent.com/20636750/108612702-f1e14a00-739f-11eb-90f0-c4c7d3399d48.png)

*6. View Hike No Pre-Trip*
![view-hike-no-pretrip](https://user-images.githubusercontent.com/20636750/108612704-f279e080-739f-11eb-9da1-577107cb4050.png)

*7. Add New Pre-Trip*
![add-pre-trip](https://user-images.githubusercontent.com/20636750/108612703-f279e080-739f-11eb-8c39-0d4e75383ab9.png)

*8. View Pre-Trip*
![pre-trip-report](https://user-images.githubusercontent.com/20636750/108612705-f3127700-739f-11eb-810f-1e7f5c7149c6.png)

*9. View Hike No Post-Trip*
![view-hike-no-post-trip](https://user-images.githubusercontent.com/20636750/108612706-f3127700-739f-11eb-9cf3-cd9b4a87fc56.png)

*10. View Hike Completed Post-Trip*
![view-hike-complete](https://user-images.githubusercontent.com/20636750/108612707-f3ab0d80-739f-11eb-9435-f0b284fe533f.png)

*11. Edit Hike*
![edit-hike](https://user-images.githubusercontent.com/20636750/108612708-f3ab0d80-739f-11eb-9a05-d5b89f2e9be9.png)

*12. Edit Pre-Trip*
![edit-pre-trip](https://user-images.githubusercontent.com/20636750/108612710-f443a400-739f-11eb-8771-4e7e702fcc9c.png)

*13. Edit Post-Trip*
![edit-post-trip](https://user-images.githubusercontent.com/20636750/108612711-f443a400-739f-11eb-9777-972147613244.png)

*14. Edit Account*
![edit-account](https://user-images.githubusercontent.com/20636750/108612709-f3ab0d80-739f-11eb-9249-1f153f0f137b.png)

*15. View All Hikes with Search*
![view-all-hikes](https://user-images.githubusercontent.com/20636750/108612712-f4dc3a80-739f-11eb-8aa1-5ba71a2251ea.png)

## Technologies

- MongoDB
- ExpressJS
- Angular 1.x
- Node
- Bcrypt
- Angular UI

## Setup Instructions

1. Git clone project.
2. `npm install` all packages. (*Important Note:* If `npm` fails with any installation of `bcrypt`, please install yarn via `sudo npm install yarn -g`), and then run `sudo yarn install` and `bcrypt` should install just fine. [Contact me](http://sasquatchcreative.com/contact) with any issues if there are any.
3. `bower install` all packages.
4. If in doubt, please see the `package.json` and `bower.json` files to see any necessary dependencies.

## Features

- User login and registration, with validations and strong password.
- User dashboard displaying recently updated hikes.
- Create a new hike, recording round-trip distances and elevation gain.
- Automatically receive a travel time estimate for your hike.
- Create a pre-trip form, before you leave, to ensure better preparation and safety.
- Create a post-trip form, upon return, recording your experiences and actual travel times.
- See stats for fully completed hikes.
- Edit your user profile (with validations).
- Field error highlighting.

## Completed Improvements

+ 01/16/18 - Error highlighting added to all input forms. (no more red error messages 🤗).
+ 11/13/17 - Can now add / edit hike start and end dates.
+ 10/07/17 - Fixed bug with stats feature.
+ 09/03/17 - Add scrolls for user actions and troubleshooted any mobile issues.
+ 09/01/17 - Stats feature added.
+ 08/31/17 - Delete Hike, Delete Post-Trip, Delete Pre-Trip features added.
+ 08/30/17 - Edit Hike, Edit Post-Trip, Edit Pre-Trip features added.
+ 08/28/17 - PostTrip feature with validations added.
+ 08/27/17 - View Hike feature added.
+ 08/27/17 - All Hikes feature and Search added.
+ 08/26/17 - PreTrip feature with validations added.
+ 08/17/17 - Add New Hike feature completed with Validations.
+ 08/08/17 - Secured API routes and Angular routes for valid session user only.
+ 08/07/17 - Cleaned up all methods and added descriptive commenting / doc string notation.
+ 08/01/17 - Added User Account Update feature and added User Messages.
+ 07/23/17 - Created separate `navController`, which handles all back-end navigation actions.
+ 07/22/17 - Moved bulk sum of User validations to Models file.
+ 07/21/17 - Added feature so username OR email allows for login validation.
+ 07/20/17 - Cleaned up modal controllers.
+ 07/19/17 - Added 'Never show this message again' setting to Dashboard Welcome Message.

## Dugout (Next Feature)

+ All Hikes: View all hikes should be sorted by hiked date (completed), or by pre-trip date.

## Future Features Wish List

+ Add Trip Photos -- let users add photos to trip

+ Add social media linkages -- let users share out their hikes and photos!

+ Change <input type="url"> on all location URL fields!

+ Add TOS/User Agreement/ETC to homepage

+ Add "Quick Estimator" tool for quick time estimates (and even a setting to tweak hiking speed)

+ Add a feature where validation errors display as bootstrap error form stylings in real-time. (medium-priority)

+ Make stats feature able to restrict to timeframe... (high)

+ Bring in better icon set than glyphicon (woof)

+ Add footer to homepage(s)

+ Add Time Picker for Actual Travel Times? (day-hike only? think this one out a bit)

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

+ Delete User Account Feature -- Thursday (if Time) (high priority)

+ Add a weather API so that a zip code could be entered to get weather data?? (medium-priority)

+ Make trip, pre-trip and post-trip different colors, and have each bit of information be a unique shade as well based upon the general color its contained within (for example, if the trip section was blue, each trip sub-field would be a shade of blue that meshed with the overall design). The more you can visually break up your fields and data, the better. (medium-priority)

+ Change hiking slugs to index value rather than id... (low-priority as may have to re-write some queries could be intense)

## Important Needed Features
- Add "Edit Pre-Trip" or "Edit Post-Trip" buttons to "Edit Hike" page if either is relevant to Hike under question. (Perhaps as an additional info pane as a single column with a button, if only pre-trip. Or 2 columns if pre-trip and post-trip).

- Clean up visual display of information, add colors to help visually differentiate each information section.

- Turn the view hike / post-trip / pre-trip into accordions, like the homepage, instead of the stacked cards like they are now.

- Pre-Trip: Add "Driving conditions", ie, do you have to drive on any forest roads? Do you have extra equipment? (sleeping, water, axe, power jumper, etc)


## Important Bugs
+ Too long of weather input on View Hike page (this occurs with Post-Trip specifically, and could be a Post-trip only issue) will run *off page*. High priority fix.

+ Add appropriate "Edit Pre-Trip" AND / OR "Complete Post-Trip" buttons to "Edit Hike" page. That way if you click Edit Page you can instantly edit either pre or post if exists.

+ "All Hikes" page: "View all stats" looks goofy up top -- can you just make this a nice clean button instead?

+ Found Bug 1/8/18: If you ADD HIKE and do not use appropriate alphanumerical characters, ONLY the alpha_num checks fire; the other validation messages do not appear?

+ See line 854 on User-model.js. Why are you manually doing validations when you could be using Mongoose validations (like you are doing elsewhere...)?

+ Post-Trip is able to be completed for dates in the future.

+ Edit Hike, Edit Pre-Trip form does not alert user if "nothing has changed". If non-changed form is submitted, it says, "Hike successfully updated!". This is inaccurate. Can you better guide your users and do a check? How do you want to approach this? (Query for the hike and then compare it against formData?)

+ Add Location URL regex validation to make sure an actual URL is used (https:// and http:// validation)

## Developer Note
- Throughout the project there are some comments denoted by `Development Note` which may provide some insight into future improvements, etc. If you wish to see all development notes, do a search in the project for "development note".
