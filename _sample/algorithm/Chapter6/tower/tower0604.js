//起動時の処理
function setup() {
    canvasSize(1080, 1264);
    loadImg(0, "image/bg1.png");
}

//メインループ
function mainloop() {
    drawBG();
}

var SIZE = 72;
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
var arrow = ["", "↑", "↓", "←", "→", "Ｃ"];
var ESET_X = [0, 4, 10, 14];//┬敵が出現するマス
var ESET_Y = [1, 0,  0,  1];//┘

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
                fText(arrow[stage[y][x]], cx+SIZE/2, cy+SIZE/2, 30, "cyan");
            }
        }
    }
    for(var i=0; i<4; i++) {
        var cx = ESET_X[i]*SIZE+SIZE/2;
        var cy = ESET_Y[i]*SIZE+SIZE/2;
        sCir(cx, cy, 30, "yellow");
    }
}