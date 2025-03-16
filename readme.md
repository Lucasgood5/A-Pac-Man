# A PacMan Game
This small repo is a webpage with a pacman game.
Was initially started for a joke with face instead of pacman and ghost.
But i realized that this could also be a good and simple portfolio item.

## Project Organisation
For PacMan and ghost i used a superclass 'MobileEntity' with a MovementHandler.
This way i don't have to write similar methods for both.
It detect wall based on two thing, a wall grid, and a snaping with tolerance.
Ghost PathFinding can also use these methods to take decision.

About Pathfinding, i used a *Strategy design pattern*, as we may want to have different behaviour for different ghost.

Even if i didn't really used a composite or decorated design pattern, i followed a schem where class should have their own draw() methods, and container should call their child draw() before themselve.

## Disclaimer
Right now this project is far aways from an end,
there is a lot of bad thing, and improvement to be done.
By this commit, i had worked about 9 hours on it.
I published it early for some friend to see it.