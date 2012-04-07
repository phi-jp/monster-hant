/**
 * phi
 */

enchant();

var game = null;

window.onload = function() {
    game = new Game(320, 320);
    game.onload = function() {
        game.rootScene.backgroundColor = "black";
    };
    game.start();
};
