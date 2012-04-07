/**
 * phi
 */

enchant();

// リソース
var IMAGE_PATH = "lib/enchant.js/images/"
var BG1 = IMAGE_PATH + "avatarBg1.png";
var BG2 = IMAGE_PATH + "avatarBg2.png";
var BG3 = IMAGE_PATH + "avatarBg3.png";
var RESOURCE = [
    BG1, BG2, BG3
];

// 定数
var BG_Y = 50;
var PLAYER_BASE_Y = BG_Y + 20;
var PLAYER_STEP_Y = 45;

// グローバル変数
var game = null;
var bg   = null;

window.onload = function() {
    game = new Game(320, 320);
    game.preload(RESOURCE);
    game.keybind('Z'.charCodeAt(0), 'a');
    
    game.onload = function() {
        // 背景を無理矢理対応
        for (var i=1; i<=3; ++i)
            game.assets["avatarBg"+i+".png"] = game.assets[IMAGE_PATH + "avatarBg"+i+".png"];
        
        // セットアップ
        var scene = game.rootScene;
        game.rootScene.backgroundColor = "black";
        
        // 背景
        bg = new AvatarBG(1);
        bg.y = BG_Y;
        scene.addChild(bg);
        
        // プレイヤー
        player = new Avatar("2:2:1:2004:21230:22480");
        scene.addChild(player);
        player.y = PLAYER_BASE_Y;
        player.posIndex = 0;
        player.onenterframe = function() {
            var input = game.input;
            if (input.pressUp && this.posIndex > 0) {
                --this.posIndex;
            }
            
            if (input.pressDown && this.posIndex < 2) {
                ++this.posIndex;
            }
            this.y = PLAYER_BASE_Y + PLAYER_STEP_Y*this.posIndex;
        };
        game.onenterframe = function() {
            var input = game.input;
            if (input.up && !input.prevUp) {
                input.pressUp = true;
            }
            else {
                input.pressUp = false;
            }
            if (input.down && !input.prevDown) {
                input.pressDown = true;
            }
            else {
                input.pressDown = false;
            }
            input.prevUp   = input.up;
            input.prevDown = input.down;
        };
    };
    game.start();
};




