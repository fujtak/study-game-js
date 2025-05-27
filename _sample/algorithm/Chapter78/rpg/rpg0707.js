class characterClass {//キャラクター用のクラス
    constructor() {//コンストラクター
        this.name  = null;
        this.level = 0;
    }

    join(n) {//初期値の代入
        this.name  = "一人目のパーティメンバー";
        this.level = 1;
    }

    levelup() {//レベルアップ
        this.level += 1;
    }
}

var chara;//インスタンスとなる変数

function setup() {
    canvasSize(800, 1000);
    clrMsg();
    chara = new characterClass();
    setMsg("chara = new characterClass()");
    setMsg("とし、インスタンスを作りました");
}

function mainloop() {
    fill("black");
    gtime++;
    fText(digit0(int(gtime/30/60/60),2)+":"+digit0(int(gtime/30/60),2)+":"+digit0(int(gtime/30)%60,2), 700, 30, 30, "white");
    fText(chara.name, 400, 200, 40, "white");
    fText("レベル "+chara.level, 400, 300, 40, "white");
    putMsg(400, 500);//メッセージの表示
    if(hexBtn(200, 800, 120, 60, 20, "join") == true) {
        chara.join();//インスタンスのメソッドを実行
        setMsg("chara.join()を実行しました");
    }
    if(hexBtn(600, 800, 120, 60, 20, "levelup") == true) {
        chara.levelup();//インスタンスのメソッドを実行
        setMsg("chara.levelup()を実行しました");
    }
}

//各種の変数
var gtime   = 0;

function hexBtn(x, y, w, h, t, txt) {//六角形のボタン
    var ret = false;
    var xy = [
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
            col = "cyan";
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

function drawFrame(x, y, w, h, col) {//枠を描く
    lineW(2);
    setAlp(60);
    fRect(x, y, w, h, col);
    setAlp(100);
    sRect(x, y, w, h, "white");
}

//メッセージの管理
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