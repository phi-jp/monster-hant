/**
 * phi
 */

enchant();

// リソース
var EXAMPLE_PATH    = "lib/enchant.js/examples/avatar/";
var IMAGE_PATH      = "lib/enchant.js/images/";

var AVATAR_CODE     = "1:3:0:2009:2109:27540";
var BG1 = IMAGE_PATH + "avatarBg1.png";
var BG2 = IMAGE_PATH + "avatarBg2.png";
var BG3 = IMAGE_PATH + "avatarBg3.png";
var BUG_IMAGE       = EXAMPLE_PATH + "monster/monster1.gif";
var DRAGON_IMAGE    = EXAMPLE_PATH + "monster/bigmonster1.gif";
var RESOURCE = [
    BG1, BG2, BG3,
    BUG_IMAGE,
    DRAGON_IMAGE,
];

// 定数
var BG_Y = 50;
var CHARACTER_BASE_Y    = BG_Y + 20;
var CHARACTER_STEP_Y    = 45;
var PLAYER_SPEED        = 6;

// グローバル変数
var game = null;
var bg   = null;
var player = null;
var monsterList = null;

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
        game.monsterInterval = 120;
        
        // 背景
        bg = new AvatarBG(1);
        bg.y = BG_Y;
        scene.addChild(bg);
        
        // プレイヤー
        player = new Player();
        scene.addChild(player);
        player.y = CHARACTER_BASE_Y;
        
        // アバターモンスター
        monsterList = [];
        
        // タイマー表示
        var timerLabel = new Label();
        scene.addChild(timerLabel);
        timerLabel.moveTo(10, 10);
        timerLabel.color = "white";
        timerLabel.text = "";
        
        game.onenterframe = function() {
            // モンスター生成
            
            if (game.frame % game.monsterInterval == 0) {
                var monster = new Dragon();
                monster.x = 240;
                scene.addChild(monster);
                monsterList.push(monster);
            }
            
            // プレイヤーとモンスターを衝突判定
            var playerX = player.x;
            for (var i=0,len=monsterList.length; i<len; ++i) {
                var m = monsterList[i];
                if (player.posIndex == m.posIndex) {
                    if (m.x < playerX && playerX < m.x+m.width) {
                        console.log("hit");
                    }
                }
            }
            
            // 入力更新
            var input = game.input;
            
            input.pressUp   = (input.up && !input.prevUp);
            input.pressDown = (input.down && !input.prevDown);
            input.prevUp    = input.up;
            input.prevDown  = input.down;
            
            // タイマー更新
            var time = Math.floor(game.frame / game.fps);
            timerLabel.text = "Time : " + time;
        };
    };
    game.start();
};

// プレイヤー
var Player = Class.create(Avatar, {
    initialize: function() {
        Avatar.call(this, AVATAR_CODE);
        
        this.speed = PLAYER_SPEED;
        this.posIndex = 0;
        this.updateY();
    },
    
    up: function() {
        --this.posIndex;
        this.updateY();
    },
    down: function() {
        ++this.posIndex;
        this.updateY();
    },
    onenterframe: function() {
        var input = game.input;
        if (input.pressUp && this.posIndex > 0) {
            this.up();
        }
        if (input.pressDown && this.posIndex < 2) {
            this.down();
        }
        
        // 左右移動
        if (input.left) {
            this.x -= this.speed;
            this.action = "run";
            this.left();
        }
        else if (input.right) {
            this.x += this.speed;
            this.action = "run";
            this.right();
        }
        else {
            this.action = "stop";
            this.right();
        }
    },
    
    updateY: function() {
        this._element.style.zIndex = this.posIndex;
        this.y = CHARACTER_BASE_Y + CHARACTER_STEP_Y*this.posIndex;
    },
});

// モンスター
var BaseMonster = Class.create(AvatarMonster, {
    initialize: function(img) {
        AvatarMonster.call(this, img);
        
        this.action = "appear";
        this.posIndex = Math.floor(Math.random()*3);
        this.offsetY = 0;
        this.speed   = 2;
        this.update = this.appear;
        
        this.updateY();
    },
    
    onenterframe: function() {
        if (this.update) this.update();
        
        // 画面外に出たら削除
        if (this.x < -100) {
            this.parentNode.removeChild(this);
        }
    },
    
    updateY: function() {
        this._element.style.zIndex = this.posIndex;
        this.y = CHARACTER_BASE_Y + CHARACTER_STEP_Y*this.posIndex + this.offsetY;
    },

    appear: function() {
        if (this.action == "stop") {
            this.update = this.advance;
        }
    },
    
    advance: function() {
        this.x -= this.speed;
    },
});


// 虫
var Bug = Class.create(BaseMonster, {
    initialize: function() {
        BaseMonster.call(this, game.assets[BUG_IMAGE]);
        
        this.speed = 2;
    }
});


// ドラゴン
var Dragon = Class.create(BaseMonster, {
    initialize: function() {
        BaseMonster.call(this, game.assets[DRAGON_IMAGE]);
        
        this.speed = 4;
        this.offsetY = -20;
        this.updateY();
    },
});









