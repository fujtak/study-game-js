//起動時の処理
function setup() {
    canvasSize(1080, 1264);
    loadImg(0, "image/bg1.png");
    loadImg(1, "image/enemy.png");
    setEnemy();
}

//メインループ
function mainloop() {
    tmr++;
    drawBG();
    moveEnemy();
}

var SIZE = 72;
var XP = [0, 0, 0,-1, 1];//┬上下左右の各方向の座標変化の基本値
var YP = [0,-1, 1, 0, 0];//┘
var CHR_ANIMA = [0, 1, 0, 2];//キャラクターのアニメーション
var stage = [//通路のデータ
    [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0],
    [4,2,0,0,4,4,2,0,0,2,3,0,0,2,3],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    [0,4,4,2,0,2,3,0,0,4,2,0,0,2,0],
    [0,0,0,2,0,2,0,0,0,0,4,2,0,2,0],
    [0,2,3,3,0,4,4,2,0,0,0,2,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,3,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,0,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,0,0,2,0],
    [0,4,4,4,4,4,4,5,3,3,3,3,3,3,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
var ESET_X = [0, 4, 10, 14];//┬敵が出現するマス
var ESET_Y = [1, 0,  0,  1];//┘

var tmr = 0;

function drawBG() {//ゲーム画面を描く
    fill("navy");
    drawImg(0, 0, 0);
    lineW(1);
    for(var y=0; y<12; y++) {
        for(var x=0; x<15; x++) {
            var cx = x*SIZE;
            var cy = y*SIZE;
            if(stage[y][x] > 0) {
                setAlp(50);
                fRect(cx+1, cy+1, SIZE-3, SIZE-3, "#4000c0");
                setAlp(100);
                sRect(cx+1, cy+1, SIZE-3, SIZE-3, "#4060ff");
            }
        }
    }
    for(var i=0; i<4; i++) {
        var cx = ESET_X[i]*SIZE+SIZE/2;
        var cy = ESET_Y[i]*SIZE+SIZE/2;
        sCir(cx, cy, 30, "yellow");
    }
}

//敵の管理
var emy_x = 0;
var emy_y = 0;
var emy_d = 0;
var emy_s = 0;
var emy_t = 0;

function setEnemy() {//敵を出現させる
    var r = rnd(4);
    emy_x = ESET_X[r]*SIZE+SIZE/2;
    emy_y = ESET_Y[r]*SIZE+SIZE/2;
    emy_d = 0;
    emy_s = 4;
    emy_t = 0;
}

function moveEnemy() {//敵を動かす(表示も行う)
    if(emy_t == 0) {
        var d = stage[int(emy_y/SIZE)][int(emy_x/SIZE)];
        if(d == 5) {
            setEnemy();
        }
        else {
            emy_d = d;//向き
            emy_t = int(SIZE/emy_s);
        }
    }
    if(emy_t > 0) {
        emy_x += emy_s*XP[emy_d];
        emy_y += emy_s*YP[emy_d];
        emy_t--;
    }
    var sx = CHR_ANIMA[int(tmr/4)%4]*72;
    var sy = (emy_d-1)*72;
    drawImgTS(1, sx, sy, 72, 72, emy_x-SIZE/2, emy_y-SIZE/2, 72, 72);
    fText("emy_x="+emy_x+" emy_y="+emy_y, 540, 828, 30, "white");
}
