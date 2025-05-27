//起動時の処理
function setup() {
    canvasSize(1080, 1264);
    loadImg(0, "image/bg1.png");
    loadImg(1, "image/enemy.png");
    initVar();
}

//メインループ
function mainloop() {
    tmr++;
    drawBG();
    if(tmr%30 == 0) setEnemy();
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
}

//敵の管理
var EMAX = 100;
var emy_x = new Array(EMAX);
var emy_y = new Array(EMAX);
var emy_d = new Array(EMAX);//向き
var emy_s = new Array(EMAX);//移動速度
var emy_t = new Array(EMAX);//速度調整用
var emy_life = new Array(EMAX);//体力
var emy_species = new Array(EMAX);//敵の種類

function setEnemy() {//敵を出現させる
    var r = rnd(4);
    var sp = rnd(3);
    for(var i=0; i<EMAX; i++) {
        if(emy_life[i] == 0) {
            emy_x[i] = ESET_X[r]*SIZE+SIZE/2;
            emy_y[i] = ESET_Y[r]*SIZE+SIZE/2;
            emy_d[i] = 0;
            emy_s[i] = 1+sp;
            emy_t[i] = 0;
            emy_life[i] = 1;
            emy_species[i] = sp;
            break;
        }
    }
}

function moveEnemy() {//敵を動かす(表示も行う)
    for(var i=0; i<EMAX; i++) {
        if(emy_life[i] > 0) {
            if(emy_t[i] == 0) {
                var d = stage[int(emy_y[i]/SIZE)][int(emy_x[i]/SIZE)];
                if(d == 5) {
                    emy_life[i] = 0;
                }
                else {
                    emy_d[i] = d;//向き
                    emy_t[i] = int(SIZE/emy_s[i]);
                }
            }
            if(emy_t[i] > 0) {
                emy_x[i] += emy_s[i]*XP[emy_d[i]];
                emy_y[i] += emy_s[i]*YP[emy_d[i]];
                emy_t[i]--;
            }
            var sx = emy_species[i]*216 + CHR_ANIMA[int(tmr/4)%4]*72;
            var sy = (emy_d[i]-1)*72;
            drawImgTS(1, sx, sy, 72, 72, emy_x[i]-SIZE/2, emy_y[i]-SIZE/2, 72, 72);
        }
    }
}

function initVar() {//配列、変数に初期値を代入
    for(var i=0; i<EMAX; i++) emy_life[i] = 0;
}
