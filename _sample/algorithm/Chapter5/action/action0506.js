//起動時の処理
function setup() {
    canvasSize(1080, 720);
    loadImg(0, "image/bg.png");
    for(var i=1; i<=6; i++) loadImg(i, "image/chip"+i+".png");
    loadImg(10, "image/mgirl0.png");
    setStage();
}

//メインループ
function mainloop() {
    movePlayer();
    drawGame();
}

//プレイヤーキャラを管理する変数
var plX = 108;
var plY = 36;
var plXp = 0;
var plYp = 0;
var plJump = 2;

//マップデータ
var mapdata = new Array(10);
for(var y=0; y<10; y++) mapdata[y] = new Array(150);

function setStage() {//地形を用意する
    var i, n, x, y;
    for(y=0; y<10; y++) {//データをクリア
        for(x=0; x<150; x++) mapdata[y][x] = 0;
    }
    for(x=0; x<150; x++) mapdata[9][x] = 1;//一番下の地面
    x = 0;
    y = 8;
    n = 5;
    do {//ランダムにブロックを配置
        for(i=0; i<n; i++) {
            mapdata[y][x] = 2;
            x++;
        }
        y = 2+rnd(7);
        n = 2+rnd(3);
    }
    while(x < 140);

    mapdata[8][149] = 6;//ゴールのクリスタル
}

var SIZE = 72;
var scroll = 0;
function drawGame() {//ゲーム画面を描く
    var c, x, y;
    var cl = int(scroll/SIZE);
    var ofsx = scroll%SIZE;
    drawImg(0, 0, 0);//背景画像
    for(y=0; y<10; y++) {//マップチップの表示
        for(x=0; x<16; x++) {
            c = mapdata[y][x+cl];
            if(c > 0) drawImg(c, x*SIZE-ofsx, y*SIZE);
        }
    }
    drawImg(10, plX-SIZE/2, plY-SIZE/2);
}

var CXP = [-36,  35, -36, 35];//┬四隅の座標の定義
var CYP = [-36, -36,  35, 35];//┘
var WALL = [0, 1, 1, 0, 0, 0, 0];//チップが壁かを定義(1が壁)
function chkWall(cx, cy) {//壁があるかを調べる関数
    var c = 0;
    if(cx < 0 || 15*SIZE < cx) c++;//画面の左端と右端
    for(var i=0; i<4; i++) {//四隅を調べる
        var x = int((cx+CXP[i])/SIZE);
        var y = int((cy+CYP[i])/SIZE);
        if(0 <= x && x <=149 && 0<=y && y<=9) {
            if(WALL[mapdata[y][x]] == 1) c++;
        }
    }
    return c;
}

function movePlayer() {//プレイヤーキャラの移動

    //X軸方向の移動
    if(key[37] > 0) {
        plXp = -12;
    }
    else if(key[39] > 0) {
        plXp = 12;
    }
    else {
        plXp = 0;
    }
    if(chkWall(plX+plXp, plY) != 0) {
        plXp = 0;
    }
    plX += plXp;

    //Y軸方向の移動（ジャンプと落下の処理）
    if(plJump == 0) {//床にいる
        if(chkWall(plX, plY+1) == 0) {//床が無いと落下
            plJump = 2;
        }
        else if(key[32] == 1) {
            plYp = -72;
            plJump = 1;
        }
    }
    else if(plJump == 1) {//ジャンプ中
        plYp += 12;
        if(plYp > 0) plJump = 2;
    }
    else {//落下中
        plYp += 12;
        if(plYp > 36) plYp = 36;
    }
    if(chkWall(plX, plY+plYp) != 0) {
        plYp = 0;
        if(plJump == 1) {//ジャンプ中→壁に当たったか
            plJump = 2;
        }
        else if(plJump == 2) {//落下中→床に着いたか
            plJump = 0;
        }
    }
    plY += plYp;
}
