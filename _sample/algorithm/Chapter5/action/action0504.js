//起動時の処理
function setup() {
    canvasSize(1080, 720);
    loadImg(0, "image/bg.png");
    for(var i=1; i<=6; i++) loadImg(i, "image/chip"+i+".png");
    setStage();
}

//メインループ
function mainloop() {
    if(inkey == 37 && scroll > 0) scroll -= 12;//左キー
    if(inkey == 39 && scroll < SIZE*135) scroll += 12;//右キー
    drawGame();
}

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
            sRect(x*SIZE, y*SIZE, SIZE, SIZE, "white");//確認用の格子
        }
    }
    fText("scroll="+scroll, 144, 72, 30, "cyan");//scrollの値を表示
}
