# Monstermind #
**Version:** 1.0.0   


A simple text-based JavaScript "Mastermind" game.

## Description ##

This was inspired by the classic [Mastermind](https://en.wikipedia.org/wiki/Mastermind_%28board_game%29) game (invented by [Mordecai Meirowitz](https://en.wikipedia.org/wiki/Mordecai_Meirowitz)), which my son received as an Easter gift.

This project builds on ideas from various sources, among them:

* [Anko's JavaScript example](http://gamedev.stackexchange.com/questions/59274/how-to-create-a-text-based-game) (search the page for "Same in JS")

No attribution is necessary to use Monstermind; [I am merely hopeful it will prove useful to you in your projects.]


## Installation ##

1. Place <code>index.html</code> and the <code>js</code> directory (containing <code>game.js</code>) in your web server's root directory

## How To Play ##

1. Load <code>index.html</code> in your browser and you should see the game board loaded with instructions on how to play
2. You have 10 guesses to determine the correct code (consisting of a 4 character-long string made up of a random sequence of the letters 'A' through F)
3. You will get one black marker for each letter that you guess correctly (e.g., it is the correct letter in the correct position in the code sequence)
4. You will get one white marker for each letter that is contained in the code but in the wrong position
    
## Changelog ##

### 1.0.0 ###
Release Date: April 15, 2016

* Initial release
