var BALL_MAX = 2;
var ballX  = new Array(BALL_MAX);
var ballY  = new Array(BALL_MAX);
var ballVx = new Array(BALL_MAX);
var ballVy = new Array(BALL_MAX);

var drag = 0;

//起動時の処理
function setup() {
    canvasSize(1200, 800);
    loadImg(0, "image/bg.png");
    for(var i=0; i<BALL_MAX; i++) loadImg(1+i, "image/ball"+i+".png");
    initVar();
}

//メインループ
function mainloop() {
    drawImg(0, 0, 0);//背景画像
    for(var i=0; i<BALL_MAX; i++) drawImgC(1+i, ballX[i], ballY[i]);
    myBall();
    moveBall();
}

function moveBall() {//ボールを動かす関数
    for(var i=0; i<BALL_MAX; i++) {
        ballX[i] = ballX[i] + ballVx[i];
        ballY[i] = ballY[i] + ballVy[i];
        if(ballX[i]< 340 && ballVx[i]<0) ballVx[i] = -ballVx[i];
        if(ballX[i]> 860 && ballVx[i]>0) ballVx[i] = -ballVx[i];
        if(ballY[i]< 140 && ballVy[i]<0) ballVy[i] = -ballVy[i];
        if(ballY[i]> 660 && ballVy[i]>0) ballVy[i] = -ballVy[i];
        ballVx[i] = ballVx[i] * 0.95;
        ballVy[i] = ballVy[i] * 0.95;
    }
    if(getDis(ballX[0], ballY[0], ballX[1], ballY[1]) <= 80) {//ヒットチェック
        var vx = ballVx[0];
        var vy = ballVy[0];
        ballVx[0] = ballVx[1];
        ballVy[0] = ballVy[1];
        ballVx[1] = vx;
        ballVy[1] = vy;
    }
}

function myBall() {//ボールを引っ張って飛ばす関数
    if(drag == 0) {//つかむ
        if(tapC == 1 && getDis(tapX, tapY, ballX[0], ballY[0]) < 60) drag = 1;
    }
    if(drag == 1) {//ひっぱる
        //引く強さが判るように多角形を表示
        lineW(3);
        sPol([tapX-30, tapY, tapX+30, tapY, ballX[0], ballY[0]], "silver");
        sPol([tapX, tapY-30, tapX, tapY+30, ballX[0], ballY[0]], "lightgray");
        sPol([tapX-30, tapY, tapX, tapY+30, tapX+30, tapY, tapX, tapY-30], "white");
        //どの向きに飛ぶか判るように線を表示
        var dx = ballX[0] - tapX;
        var dy = ballY[0] - tapY;
        line(ballX[0], ballY[0], ballX[0]+dx, ballY[0]+dy, "white");
        if(tapC == 0) {//離した時
            if(tapX < 10 || 1190 < tapX || tapY < 10 || 790 < tapY) {
                drag = 0;//やり直し
            }
            else if(getDis(tapX, tapY, ballX[0], ballY[0]) < 60) {
                drag = 0;//やり直し
            }
            else {
                ballVx[0] = (ballX[0] - tapX)/8;
                ballVy[0] = (ballY[0] - tapY)/8;
                drag = 0;
            }
        }
    }
}

function initVar() {//配列に初期値を代入
    for(var i=0; i<BALL_MAX; i++) {
        ballX[i] = 400+i*80;
        ballY[i] = 200+i*80;
        ballVx[i] = rnd(80)-40;//┬確認用に乱数の値を代入
        ballVy[i] = rnd(80)-40;//┘
    }
}
