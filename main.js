/**
 * phi
 */

enchant();

// リソース
var IMAGE_PATH      = "lib/enchant.js/images/";

var START_IMAGE     = IMAGE_PATH + "start.png";
var END_IMAGE       = IMAGE_PATH + "end.png";
var AVATAR_CODE     = "1:3:0:2009:2109:27540";
var BG1 = IMAGE_PATH + "avatarBg1.png";
var BG2 = IMAGE_PATH + "avatarBg2.png";
var BG3 = IMAGE_PATH + "avatarBg3.png";
var BUG_IMAGE       = IMAGE_PATH + "monster/monster1.gif";
var DRAGON_IMAGE    = IMAGE_PATH + "monster/bigmonster1.gif";

var MAIN_BGM        = "http://enchantjs.com/assets/sounds/bgm02.wav";  // メインBGM
var APPEAR_SE       = "http://enchantjs.com/assets/sounds/se3.wav";    // 出現時SE

var RESOURCE = [
    START_IMAGE, END_IMAGE,
    BG1, BG2, BG3,
    BUG_IMAGE,
    DRAGON_IMAGE,
    MAIN_BGM, APPEAR_SE,
];
// nineleap 対応
enchant.nineleap = { assets: [START_IMAGE, END_IMAGE] };

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
var timerLabel = null;

window.onload = function() {
    game = new Game(320, 320);
    game.preload(RESOURCE);
    game.keybind('Z'.charCodeAt(0), 'a');
    
    game.onload = function() {
        // 背景を無理矢理対応
        for (var i=1; i<=3; ++i)
            game.assets["avatarBg"+i+".png"] = game.assets[IMAGE_PATH + "avatarBg"+i+".png"];
        game.assets["start.png"]    = game.assets[START_IMAGE];
        game.assets["end.png"]      = game.assets[END_IMAGE];
        
        // セットアップ
        var scene = game.rootScene;
        game.rootScene.backgroundColor = "black";
        game.monsterInterval = 120;
        game.dragomRate = 0;
        
        // 背景
        bg = new AvatarBG(1);
        bg.y = BG_Y;
        scene.addChild(bg);
        
        // プレイヤー
        player = new Player();
        scene.addChild(player);
        player.y = CHARACTER_BASE_Y;
        
        scene.onenter = function() {
            // 初期化
            game.frame = 0;
            
            // アバターモンスター
            monsterList = [];
            
            // タイマー表示
            timerLabel = new Label();
            scene.addChild(timerLabel);
            timerLabel.moveTo(10, 10);
            timerLabel.color = "white";
            timerLabel.text = "";
        };
        
        scene.onenterframe = function() {
            // モンスター生成
            if (game.frame % game.monsterInterval == 0) {
                var monster;
                var r = Math.floor(Math.random()*100);
                if (r < game.dragonRate) {
                    monster = new Dragon();
                }
                else {
                    monster = new Bug();
                }
                monster.x = 240;
                scene.addChild(monster);
                monsterList.push(monster);
                
                // 出現 SE 再生
                game.assets[APPEAR_SE].clone().play();
            }
            
            // プレイヤーとモンスターを衝突判定
            var playerX = player.x;
            var playerX2= player.x+player.width
            for (var i=0,len=monsterList.length; i<len; ++i) {
                var m = monsterList[i];
                if (player.posIndex == m.posIndex) {
                    var mx = m.x+20;
                    var mx2= m.x+m.width-20;
                    if (mx < playerX && playerX < mx2 || mx < playerX2 && playerX < mx2) {
                        endGame();
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
            
            // 難易度変更
            if (game.frame == 300) {
                game.monsterInterval = 90;
            }
            else if (game.frame == 600) {
                game.monsterInterval = 60;
            }
            else if (game.frame == 900) {
                game.monsterInterval = 40;
                game.dragonRate = 10;
            }
            else if (game.frame == 1200) {
                game.monsterInterval = 30;
                game.dragonRate = 20;
            }
            
            // BGM 再生
            game.assets[MAIN_BGM].play();
        };
    };
    game.start();
};

// ゲーム終了
var endGame = function() {
    var TITLE_TABLE = [
        "ヨケモンもどき",
        "ヨケモン見習い",
        "ヨケモン社会人",
        "ヨケモンマニア",
        "ヨケモンマスター",
    ];
    var time  = Math.floor(game.frame/game.fps);
    var tIndex= Math.floor(time/10);
    tIndex = (tIndex >= TITLE_TABLE.length) ? TITLE_TABLE.length-1 : tIndex;
    var title = TITLE_TABLE[tIndex];
    var score = time * 100;
    var msg   = "あなたのスコアは" + score + "です. 称号「" + title + "』";
    console.log(score, msg);
    game.end(score, msg);
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
        
        this.speed = 4;
    }
});


// ドラゴン
var Dragon = Class.create(BaseMonster, {
    initialize: function() {
        BaseMonster.call(this, game.assets[DRAGON_IMAGE]);
        
        this.speed = 6;
        this.offsetY = -20;
        this.updateY();
    },
});









