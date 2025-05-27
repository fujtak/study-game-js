class characterClass {//キャラクター用のクラス
    constructor() {//コンストラクター
        this.name  = null;
        this.level = 0;
        this.exp   = 0;
        this.lfmax = 0;
        this.life  = 0;
        this.stren = 0;
        this.defen = 0;
        this.agili = 0;
        this.pos   = 0;
        this.dmg   = 0;
        this.efct  = 0;
        this.etime = 0;
    }

    join(n) {//初期値の代入
        n = n*6;
        this.name  = CHR_DATA[n];
        this.level = CHR_DATA[n+1];
        this.exp   = 10*(this.level-1)*(this.level-1);
        this.lfmax = CHR_DATA[n+2];
        this.life  = this.lfmax;
        this.stren = CHR_DATA[n+3];
        this.defen = CHR_DATA[n+4];
        this.agili = CHR_DATA[n+5];
        this.pos   = 0;
        this.dmg   = 0;
        this.efct  = 0;
        this.etime = 0;
    }

    levelup() {//レベルアップ
        this.level += 1;
        this.lfmax += (10+rnd(10));
        this.stren += rnd(10);
        this.defen += rnd(5);
        this.agili += rnd(5);
    }
}

function setup() {
    canvasSize(800, 1000);
    var IMG = ["title", "bg", "character0", "character1", "character2", "enemy"];
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
}

function mainloop() {
    var i, x, y, w, h, col, btn;//汎用的に使う変数
    counter++;
    if(scene < 40) {//背景の表示
        drawImgTS(1, 0, 0, 800, 1000, 0, 0, 800, 1000);//居住ドーム
    }
    else {
        drawImgTS(1, 800, 0, 800, 1000, 0, 0, 800, 1000);//探索するドーム
        setAlp(30);
        fRect(0, 0, 800, 1000, DOME_COLOR[sel_dome]);
        setAlp(100);
    }
    if(scene == 1) {
        fText(digit0(int(gtime/30/60/60),2)+":"+digit0(int(gtime/30/60),2)+":"+digit0(int(gtime/30)%60,2), 700, 30, 30, "white");
    }
    if(scene > 0) {
        btn = menuBtn();//メニューボタン
        gtime++;
    }

    switch(scene) {
        case 0://タイトル画面
        drawImg(0, 0, 50);//タイトルロゴ
        if(counter%40 < 20) fText("CLICK TO START.", 400, 600, 40, "white");
        if(tapC > 0) {
            initVar();
            tapC = 0;
            scene = 1;
        }
        break;

        case 1://ホーム画面
        fText("敵が登場することを確認しましょう", 400, 400, 40, "white");
        for(i=0; i<3; i++) {//行き先のボタン
            if(hexaBtn(150+i*250, 110, 220, 60, 20, DOME_NAME[i])) {
                clrMsg();
                sel_dome = i;
                scene = 40;
                counter = 0;
                break;
            }
        }
        if(btn > 1) {//メニューボタンが押されたら各画面へ遷移する
            scene = (btn-1)*10;
            counter = 0;
        }
        break;

        case 10://パーティ画面
        for(i=0; i<MEMBER_MAX; i++) {
            x = 160+i*240;
            y = 50;
            if(tapC==1 && x-100<tapX && tapX<x+100 && y-30<tapY && tapY<y+30) {
                tapC = 0;
                sel_member = i;
            }
            col = "black";
            if(i == sel_member) col = "navy";
            drawFrame(x-100, y-30, 200, 60, col);
            fText(chara[i].name, x, y, 30, "white");
        }
        drawFrame(20, 100, 760, 690, "black");
        n = 2+sel_member;
        w = img[n].width;
        h = img[n].height;
        drawImgTS(n, 0, 0, w, h, 60, 100, w*0.85, h*0.85);
        var nexp = chara[sel_member].level*chara[sel_member].level*10;
        x = 460;
        y = 150;
        fText("レベル", x, y, 30, "white");
        fText("経験値", x, y+60, 30, "white");
        fText("次のレベルアップ", x, y+120, 20, "white");
        fText("ライフ", x, y+240, 30, "white");
        fText("攻撃力", x, y+300, 30, "white");
        fText("防御力", x, y+360, 30, "white");
        fText("素早さ", x, y+420, 30, "white");
        x = 620;
        fText(chara[sel_member].level, x, y, 30, "white");
        fText(chara[sel_member].exp,   x, y+60, 30, "white");
        fText(nexp, x, y+120, 30, "white");
        fText(chara[sel_member].life + "/" + chara[sel_member].lfmax, x, y+240, 30, "white");
        fText(chara[sel_member].stren, x, y+300, 30, "white");
        fText(chara[sel_member].defen, x, y+360, 30, "white");
        fText(chara[sel_member].agili, x, y+420, 30, "white");
        if(btn == 1) toHome();//ホーム画面に戻る
        break;

        case 20://クリーチャー画面トップ
        case 21://クリーチャーの説明
        for(i=0; i<CREATURE_MAX; i++) {
            x = 266*(i%3);
            y = 266*int(i/3);
            if(tapC==1 && x<tapX && tapX<x+266 && y<tapY && tapY<y+266) {
                tapC = 0;
                sel_creature = i;
            }
            col = "black";
            if(i == sel_creature) col = "navy";
            drawFrame(x+8, y+8, 250, 250, col);
            var sx = 400*int(i/3);
            var sy = 400*(i%3);
            drawImgTS(5, sx, sy, 400, 400, x+8, y+8, 250, 250);
            fText(CREATURE[i*2],   x+100, y+240, 24, "white");
            fText("x捕獲数", x+210, y+240, 18, "white");
        }
        if(scene == 21) {//クリーチャーの能力
            y = 266*(1+int(sel_creature/3));
            if(sel_creature >= 6) y -= 470;
            drawFrame(40, y, 720, 210, "black");
            setCreature(0, sel_creature);
            fText(chara[EMY_TOP].name, 220, y+30, 30, "yellow");
            fText("ライフ " + chara[EMY_TOP].lfmax, 220, y+80, 30, "white");
            fText("経験値 "+chara[EMY_TOP].exp, 220, y+130, 30, "white");
            fText("攻撃力 " + chara[EMY_TOP].stren, 580, y+ 30, 30, "white");
            fText("防御力 " + chara[EMY_TOP].defen, 580, y+ 80, 30, "white");
            fText("素早さ " + chara[EMY_TOP].agili, 580, y+130, 30, "white");
            fText(CREATURE[sel_creature*2+1], 400, y+180, 30, "cyan");//説明文
            if(tapC>0 || btn>0) {
                tapC = 0;
                btn = 0;
                scene = 20;
            }
        }
        if(btn == 1) toHome();//ホーム画面に戻る
        if(btn == 2) scene = 21;//データの表示
        break;

        case 30://研究施設画面トップ
        drawFrame(10, 10, 780, 60, "black");
        fText("研究進捗度", 100, 40, 30, "white");
        drawFrame(10, 80, 780, 700, "black");
        fText("開発済みアイテム", 400, 120, 30, "yellow");
        for(i=0; i<ITEM_MAX; i++) {
            y = 200+60*i;
            if(tapC==1 && 100<tapX && tapX<700 && y-30<tapY && tapY<y+30) {
                tapC = 0;
                sel_item = i;
            }
            col = "white";
            if(i == sel_item) col = "cyan";
            fText(ITEM[i*3], 200, y, 30, col);
            fText("x"+item[i], 600, y, 30, col);
        }
        drawFrame(30, 700, 740, 60, "black");//説明文の枠
        fText(ITEM[sel_item*3+1], 400, 730, 30, "white");//説明文
        if(btn == 1) toHome();//ホーム画面に戻る
        break;

        case 40://探索画面
        putMsg(400, 680);//メッセージの表示
        if(btn == 1) toHome();//ホーム画面に戻る
        if(btn == 2) {
            setMsg("探索中...");
            scene = 41;
            counter = 0;
        }
        break;

        case 41://探索中
        if(counter < 40) {//背景を動かす演出
            x = -20*counter;
            drawImgTS(1, 800, 448, 800, 552, x, 448, 800, 552);
            drawImgTS(1, 800, 448, 800, 552, x+800, 448, 800, 552);
            setAlp(30);
            fRect(0, 448, 800, 552, DOME_COLOR[sel_dome]);
            setAlp(100);
        }
        putMsg(400, 680);//メッセージの表示
        if(counter < 40) break;
        if(counter == 40) {
            if(rnd(100)<50) {
                setMsg("クリーチャーを発見！");
                scene = 50;
                counter = 0;
                break;
            }
        }
        if(btn == 1) {
            setMsg("探索を中断します。");
            scene = 40;
        }
        if(btn == 2) {
            setMsg("探索中...");
            counter = 0;
        }
        break;

        case 50://戦闘開始
        putMsg(400, 680);//メッセージの表示
        if(counter%6 < 3) {
            setAlp(30);
            fRect(0, 0, 800, 1000, "black");
        }
        if(counter == 30) {
            initBtl();
            scene = 51;
        }
        break;

        case 51://戦闘画面に敵を表示（仮）
        for(i=0; i<3; i++) {//敵の表示
            x = -60+260*i;
            y = 180;
            if(chara[EMY_TOP+i].life > 0) {
                n = chara[EMY_TOP+i].level;
                var sx = 400*int(n/3);
                var sy = 400*(n%3);
                drawImgTS(5, sx, sy, 400, 400, x, y + chara[EMY_TOP+i].pos, 400, 400);
                fText(CREATURE[n*2], x+200, y-60, 30, "white");
            }
        }
        putMsg(400, 680);//メッセージの表示
        if(btn == 1) scene = 40;//仮
        break;
    }
}

//各種の変数
var scene = 0;
var counter = 0;
var sel_member = 0;
var sel_creature = 0;
var sel_item = 0;
var sel_dome = 0;

//保存が必要な変数
var gtime = 0;

var MENU = [//メニューボタン
"HOME", "パーティ", "クリーチャー", "研究施設",
"HOME", null, null, null,
"HOME", "データ", "転送", null,
"HOME", null, null, null,
"戻る", "探索", null, null,
"撤退", "回復", null, null
];

//キャラクターの管理
var MEMBER_MAX = 3;//パーティメンバーの人数
var CHARACTER_MAX = 6;//キャラクターの総数（戦闘に参加する味方＋敵の数）
var EMY_TOP = 3;//敵の添え字の開始番号
var chara = new Array(CHARACTER_MAX);
for(var i=0; i<CHARACTER_MAX; i++) chara[i] = new characterClass();

var CHR_DATA = [
"マリヤ",    1, 500, 150, 40,  60,
"ゼノン",    5, 700, 200, 70,  60,
"ビーナス", 10, 600, 200, 70, 100
];

//クリーチャーの定義
var CREATURE_MAX = 9;
var creature = new Array(CREATURE_MAX);
var CREATURE = [
"キラーワスプ",   "人を頻繁に襲う危険な蜂",
"スパイダー",     "噛まれると痛い大型の蜘蛛",
"エイプ",         "気の荒い猿のような生物",
"バンパイヤ",     "群れで人を襲う厄介な蝙蝠",
"ゴブリン",       "好戦的な猿のような生物",
"バーバリアン",   "獰猛な類人猿型の生物",
"スライム",       "うねうねと気味の悪い粘菌生物",
"デススパイダー", "好戦的で危険な大型の蜘蛛",
"ヘルマン",       "極めて獰猛な類人猿型の生物"
];

//アイテムの管理
var ITEM_MAX = 8;
var item = new Array(ITEM_MAX);
var ITEM = [
"ポーション",       "マリヤのライフを回復",      100,
"リペアキット",     "ゼノンのライフを回復",      100,
"アニマルキュア",   "ビーナスのライフを回復",    100,
"ゲートキー７",     "DOME 7 へ行けるようになる",   0,
"エネミーサーチ",   "敵を発見しやすくなる",        0,
"ゲートキーＸ",     "DOME XXX へ行けるようになる", 0,
"エネミーサーチ２", "敵を更に発見しやすくなる",    0,
"ラストアイテム",   "このゲームの最後のアイテム",  0
];

//ドームの名称、色の定義
var DOME_NAME = ["DOME\nZero", "DOME\n7", "DOME\nXXX"];
var DOME_COLOR = ["#44f", "#480", "#c00"];

function initVar() {//ゲーム用の変数に初期値を代入
    var i;
    for(i=0; i<ITEM_MAX; i++) item[i] = 1;
    clrMsg();
    chara[0].join(0);//┬パーティメンバーのパラメーターを代入
    chara[1].join(1);//│
    chara[2].join(2);//┘
}

function hexaBtn(x, y, w, h, t, txt) {//六角形のボタン
    var ret = false;//クリックされたかを返す
    var xy = [//六角形の頂点を配列で定義
     x,     y-h/2-t,
     x+w/2, y-h/2,
     x+w/2, y+h/2,
     x,     y+h/2+t,
     x-w/2, y+h/2,
     x-w/2, y-h/2
    ];
    var col = "navy";
    if(x-w/2<tapX && tapX<x+w/2 && y-h/2-t/2<tapY && tapY<y+h/2+t/2) {
        col = "blue";
        if(tapC > 0) {
            tapC = 0;
            col = "white";
            ret = true;
        }
    }
    lineW(2);
    setAlp(50);
    fPol(xy, col);
    setAlp(100);
    sPol(xy, "white");
    fTextN(txt, x, y, h/2, 30, "white");
    return ret;
}

function menuBtn() {//メニューボタン
    var btn = 0;
    var m = int(scene/10);
    for(var i=0; i<4; i++) {
        var x = 100+200*i;
        var y = 900;
        if(MENU[i+m*4] != null) {
            if(hexaBtn(x, y, 196, 100, 50, MENU[i+m*4])) btn = i+1;
        }
    }
    return btn;
}

function toHome() {//ホーム画面に戻る
    scene = 1;
    counter = 0;
}

//メッセージ関連の処理
var MSG_MAX = 5;
var msg = new Array(MSG_MAX);

function clrMsg() {
    for(var i=0; i<MSG_MAX; i++) msg[i] = "";
}

function setMsg(ms) {
    for(var i=0; i<MSG_MAX; i++) {
        if(msg[i] == "") {
            msg[i] = ms;
            return;
        }
    }
    for(var i=0; i<MSG_MAX-1; i++) msg[i] = msg[i+1];
    msg[MSG_MAX-1] = ms;
}

function putMsg(x, y) {
    drawFrame(x-370, y-100, 740, 200, "black");
    for(var i=0; i<MSG_MAX; i++) fText(msg[i], x, y-80+i*40, 28, "white");
}

function drawFrame(x, y, w, h, col) {//枠を描く
    lineW(2);
    setAlp(60);
    fRect(x, y, w, h, col);
    setAlp(100);
    sRect(x, y, w, h, "white");
}

function setCreature(n, typ) {//クリーチャーのパラメーターを計算して代入
    chara[EMY_TOP+n].name  = CREATURE[typ*2];
    chara[EMY_TOP+n].level = typ;//この属性に敵の種類を代入しておく
    chara[EMY_TOP+n].exp   = (typ+1)*5;//倒した時にもらえる経験値を代入
    chara[EMY_TOP+n].lfmax = 40+typ*30;
    chara[EMY_TOP+n].life  = chara[EMY_TOP+n].lfmax;
    chara[EMY_TOP+n].stren = 50+typ*20;
    chara[EMY_TOP+n].defen = 10+typ*10;
    chara[EMY_TOP+n].agili = 30+typ*20;
    chara[EMY_TOP+n].pos   = 0;
    chara[EMY_TOP+n].dmg   = 0;
    chara[EMY_TOP+n].efct  = 0;
    chara[EMY_TOP+n].etime = 0;
}

function initBtl() {//戦闘に入る準備（敵をセットする）
    for(var i=0; i<3; i++) {
        chara[EMY_TOP+i].life = 0;
        if(rnd(100)<30 || i==1) setCreature(i, rnd(3)+sel_dome*3);
    }
}
