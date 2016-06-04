# Weights Puzzle

Weightlifter helper app to get their wanted weight right.

see [wikipedia](https://en.wikipedia.org/wiki/Barbell#Bumper_plates "Where else...") for details...

Applies a [sub set sum](https://en.wikipedia.org/wiki/Subset_sum_problem "again...") algorihm to find the bumper plates needed for a specified weight, including the weight of the barbell.

Use the browsers local storage to keep the list of available weight plates.

Should become a single html file (for easy local access on any device) or a mobile app "really soon"(tm)

## Known Issues

* The algorithm only find the perfect solution, a near miss is still a miss. Finding the next best solution, that is the nearest weight with the availabe plates) needs some heavy tweaking.
* Still three files (html,js and css). That's easier to develop and debug (syntax highlighting and so on...)
