//起動時の処理
function setup() {
    canvasSize(1080, 720);
    loadImg(0, "image/bg.png");
    for(var i=1; i<=6; i++) loadImg(i, "image/chip"+i+".png");
    setStage();
}

//メインループ
function mainloop() {
    drawGame();
}

//マップデータ
var mapdata = new Array(10);
for(var y=0; y<10; y++) mapdata[y] = new Array(150);

function setStage() {//地形を用意する
    var x, y;
    for(y=0; y<10; y++) {//データをクリア
        for(x=0; x<150; x++) mapdata[y][x] = 0;
    }
    for(x=0; x<150; x++) mapdata[9][x] = 1+x%6;
}

var SIZE = 72;
function drawGame() {//ゲーム画面を描く
    var c, x, y;
    drawImg(0, 0, 0);//背景画像
    for(y=0; y<10; y++) {//マップチップの表示
        for(x=0; x<15; x++) {
            c = mapdata[y][x];
            if(c > 0) drawImg(c, x*SIZE, y*SIZE);
        }
    }
}
