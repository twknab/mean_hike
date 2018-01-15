/*
This module is used to help generate time estimates for hikes. The equation used to formulate this algorithm was originally published in "The Backpacker's Handbook" by Rick Curtis, 2005.

The equation is as follows:

    Travel Time = (Total Miles Traveled / 2 Miles per Hour) + (Elevation Gain in Feet / 1,000 feet) + (Total # of Hours Thus Far * 5 minutes)

The equation makes the following assumptions:
    - Avg hikers travel at a rate of 2 miles per hour.
    - Avg hikers add 1 hour travel time per 1,000 ft of gain.
    - Avg hikers need 5 minutes rest for each hour travelled.
*/

module.exports = {
  travelTime: function(hkDist, elvGain) {
    /*
    Estimates travel time in hours and minutes for a hike.

    Parameters:
    - `hkDist` - "Round trip hike distance (in miles)"
    - `elvGain` - "Total elevation gain (in feet)"
    */

    const dt = (((hkDist / 2) + (elvGain / 1000)) + ((((hkDist / 2) + (elvGain / 1000)) * 5) / 60)).toString().split('.'), // split to convert to whole minutes
      h = dt[0], // whole number hours
      m = Math.ceil(('.' + dt[1]) * 60); // convert to whole number minutes and round up to nearest whole

    return `${h} hours ${m} minutes`;
  },
}
