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
var PLAYER_STEP_Y = 20;

// グローバル変数
var game = null;
var bg   = null;

window.onload = function() {
    game = new Game(320, 320);
    game.preload(RESOURCE);
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
    };
    game.start();
};
