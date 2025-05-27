function setup() {
    canvasSize(800, 1000);
    var IMG = ["title", "bg"];
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
}

function mainloop() {
    var btn;//メニューボタンの値を入れる
    counter++;
    if(scene < 40) {//背景の表示
        drawImgTS(1, 0, 0, 800, 1000, 0, 0, 800, 1000);//居住ドーム
    }
    else {
        drawImgTS(1, 800, 0, 800, 1000, 0, 0, 800, 1000);//探索するドーム
    }
    fText(digit0(int(gtime/30/60/60),2)+":"+digit0(int(gtime/30/60),2)+":"+digit0(int(gtime/30)%60,2), 700, 30, 30, "white");
    fText("scene : "+scene, 100, 30, 30, "black");//確認用
    if(scene > 0) {
        btn = menuBtn();//メニューボタン
        gtime++;
    }

    switch(scene) {
        case 0://タイトル画面
        drawImg(0, 0, 50);//タイトルロゴ
        if(counter%40 < 20) fText("CLICK TO START.", 400, 600, 40, "white");
        if(tapC > 0) {
            clrMsg();
            tapC = 0;
            scene = 1;
        }
        break;

        case 1://ホーム画面
        if(btn > 1) {//メニューボタンが押されたら各画面へ遷移する
            scene = (btn-1)*10;
            counter = 0;
        }
        if(hexaBtn(400, 600, 240, 60, 10, "メッセージ追加")) setMsg("メッセージ追加確認 " + gtime);
        putMsg(400, 400);
        break;

        case 10://パーティ画面
        fText("【制作中】パーティメンバーの能力確認", 400, 400, 30, "yellow");
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

//保存が必要な変数
var gtime = 0;

var MENU = [//メニューボタン
"HOME", "パーティ", "クリーチャー", "研究施設",
"HOME", null, null, null,
"HOME", "データ", "転送", null,
"HOME", null, null, null
];

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
