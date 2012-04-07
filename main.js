/**
 * phi
 */

enchant();

// リソース
var EXAMPLE_PATH    = "lib/enchant.js/examples/avatar/";
var IMAGE_PATH      = "lib/enchant.js/images/";
var BG1 = IMAGE_PATH + "avatarBg1.png";
var BG2 = IMAGE_PATH + "avatarBg2.png";
var BG3 = IMAGE_PATH + "avatarBg3.png";
var DRAGON_IMAGE = EXAMPLE_PATH + "monster/bigmonster1.gif";
var RESOURCE = [
    BG1, BG2, BG3,
    DRAGON_IMAGE
];

// 定数
var BG_Y = 50;
var CHARACTER_BASE_Y = BG_Y + 20;
var CHARACTER_STEP_Y = 45;

// グローバル変数
var game = null;
var bg   = null;
var player = null;

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
        player = new Player("1:2:1:2004:21230:22480");
        scene.addChild(player);
        player.y = CHARACTER_BASE_Y;
        
        // アバターモンスター
        monster = new Dragon();
        monster.x = 220;
        scene.addChild(monster);
        
        game.onenterframe = function() {
            var input = game.input;
            
            input.pressUp   = (input.up && !input.prevUp);
            input.pressDown = (input.down && !input.prevDown);
            input.prevUp    = input.up;
            input.prevDown  = input.down;
        };
    };
    game.start();
};

// プレイヤー
var Player = Class.create(Avatar, {
    initialize: function(code) {
        Avatar.call(this, code);
        
        this.posIndex = 0;
    },
    up: function() {
        --this.posIndex;
        this.y = CHARACTER_BASE_Y + CHARACTER_STEP_Y*this.posIndex;
    },
    onenterframe: function() {
        var input = game.input;
        if (input.pressUp && this.posIndex > 0) {
            --this.posIndex;
        }
        if (input.pressDown && this.posIndex < 2) {
            ++this.posIndex;
        }
        this.y = CHARACTER_BASE_Y + CHARACTER_STEP_Y*this.posIndex;
    }
});

// モンスター
var BaseMonster = Class.create(AvatarMonster, {
    initialize: function(img) {
        AvatarMonster.call(this, img);
        
        this.action = "appear";
        this.posIndex = Math.floor(Math.random()*3);
        this.update = this.appear;
        this.offsetY = 0;
        
        this.updateY();
    },
    
    onenterframe: function() {
        if (this.update) this.update();
    },
    
    updateY: function() {
        this.y = CHARACTER_BASE_Y + CHARACTER_STEP_Y*this.posIndex + this.offsetY;
    },
    
    appear: function() {
        if (this.action == "stop") {
            this.update = this.advance;
        }
    },
    
    advance: function() {
        this.x -= 2;
    },
});

// ドラゴン
var Dragon = Class.create(BaseMonster, {
    initialize: function() {
        BaseMonster.call(this, game.assets[DRAGON_IMAGE]);
        
        this.offsetY = -10;
        this.updateY();
    },
});









