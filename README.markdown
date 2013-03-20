The Jaccia and Jacciata Cellular Automata
=========================================

Overview
--------

Jaccia and Jacciata are cellular automata inspired by the Announcement of
[Scientific Proof that Slime Molds are Intelligent Maze Solvers][].

Basically, the slime mold solves the maze by:

-   initially being everywhere in the maze
-   there being food at the entrance and exit of the maze
-   minimizing its surface area by retreating from anywhere it can't get
    food.

Jaccia operates the same way. In the Jaccia automaton, slime cells
survive if they have immediate neighbours in at least two cardinal
directions that provide sustenance, i.e. are either food or other slime
cells. The result is the same: paths of slime cells that lead down dead
ends have one end which provides no sustenance and dies off. Eventually,
only paths of slime cells that reach from food to food (or uninterrupted
circular paths of slime cells) remain. Jacciata is a more involved
automaton which finds only the shortest path.

[Scientific Proof that Slime Molds are Intelligent Maze Solvers]: http://web.archive.org/web/20020220163303/http://www.riken.go.jp/lab-www/frontier-div/NEWSLETTER/feb2001/ameboid_e.htm

Properties
----------

Jaccia has the property that, when started from this condition (entire
maze filled with slime cells), the automaton will eventually reach a
fixed point (steady state) which contains all possible orthogonal paths
from food to food.  (Orthogonal paths means, a diagonal isn't considered
a path.)

Jacciata is similar, but has the property that when it reaches a fixed
point, it will contain the *shortest* path from food to food, if such a
path exists and is unique. If no such path exists, or is not unique, the
result is undefined. It is otherwise similar to Jaccia.

Definition
----------

Both Jaccia and Jacciata are defined in ALPACA v1.0. Jaccia is defined
in the file `jaccia.alp` and Jacciata in `jacciata.alp`. The ALPACA
definition is authoritative; what is given here is merely advisory.

Both automata use basically the same set of symbols. An initial Jaccia
playfield generally serves as an initial Jacciata playfield with the
same kind of solution.

-   ` ` - empty space
-   `#` - wall (purely decorative)
-   `%` - slime mold
-   `F` - food
-   `S` - "start" food (needed in Jacciata, optional in Jaccia)
-   `-` - exploratory head (Jacciata only)
-   `?` - exploratory body (Jacciata only)
-   `@` - solved (Jacciata only)

Discussion
----------

Jacciata's definition is not very elegant, especially when compared to
Jaccia. In order for it to work, the two sources of food need to be
labelled differently (`S` and `F`), there needs to be a "head" of an
exploratory shoot that looks for solutions, and so on. It could probably
be made more elegant with some work.

[New in 1.1] The definition of these automata in ALPACA 0.94 suggested some
possible improvements to ALPACA, particularly the definition of
neighbourhoods different from the assumed von Neumann neighbourhood, and
their use in the count operator.  The Jaccia and Jacciata descriptions were
rewritten in ALPACA 1.0, and do now take advantage of these features in order
to be written more succinctly.

Happy intelligence! Such as it is.  
Chris Pressey  
April 11, 2009  
Bellevue, WA
