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
    var IMG = ["title", "bg", "character0", "character1", "character2"];
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
        fText("パーティ画面を確認しましょう", 400, 400, 40, "white");
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
        fText("【制作中】クリーチャーの確認", 400, 400, 30, "yellow");
        if(btn == 1) toHome();//ホーム画面に戻る
        break;

        case 30://研究施設画面トップ
        fText("【制作中】研究進捗度", 400, 400, 30, "yellow");
        if(btn == 1) toHome();//ホーム画面に戻る
        break;

        case 40://探索画面
        break;
    }
}

//各種の変数
var scene = 0;
var counter = 0;
var sel_member = 0;

//保存が必要な変数
var gtime = 0;

var MENU = [//メニューボタン
"HOME", "パーティ", "クリーチャー", "研究施設",
"HOME", null, null, null,
"HOME", "データ", "転送", null,
"HOME", null, null, null
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

function initVar() {//ゲーム用の変数に初期値を代入
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
