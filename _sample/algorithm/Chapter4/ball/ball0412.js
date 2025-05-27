var BALL_MAX = 6;
var ballX  = new Array(BALL_MAX);
var ballY  = new Array(BALL_MAX);
var ballVx = new Array(BALL_MAX);
var ballVy = new Array(BALL_MAX);
var cursor = new Array(BALL_MAX);//カーソル

var drag = 0;
var bnum = 0;//操作するボールの番号

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
    drawBall();
    myBall();
    moveBall();
}

function drawBall() {//ボールを描く関数
    for(var i=0; i<BALL_MAX; i++) {
        drawImgC(1+i, ballX[i], ballY[i]);
        if(cursor[i] != "") {//カーソル
            lineW(4);
            sRect(ballX[i]-40, ballY[i]-40, 80, 80, cursor[i]);
            cursor[i] = "";
        }
    }
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
        for(var j=0; j<BALL_MAX; j++) {//他のボールと衝突したかを調べる
            if(i == j) continue;
            if(getDis(ballX[i], ballY[i], ballX[j], ballY[j]) <= 80) {//ヒットチェック
                var sp0 = Math.sqrt(ballVx[i]*ballVx[i]+ballVy[i]*ballVy[i]);
                var sp1 = Math.sqrt(ballVx[j]*ballVx[j]+ballVy[j]*ballVy[j]);
                var spa = (sp0+sp1)/2;
                var dx = ballX[i] - ballX[j];
                var dy = ballY[i] - ballY[j];
                var ang = Math.atan2(dy, dx);
                ballVx[i] = spa * Math.cos(ang);
                ballVy[i] = spa * Math.sin(ang);
                ballVx[j] = -ballVx[i];
                ballVy[j] = -ballVy[i];
            }
        }
    }
}

function myBall() {//ボールを引っ張って飛ばす関数
    cursor[bnum] = "white";
    if(drag == 0) {//つかむ
        if(tapC == 1 && getDis(tapX, tapY, ballX[bnum], ballY[bnum]) < 60) drag = 1;
    }
    if(drag == 1) {//ひっぱる
        //引く強さが判るように多角形を表示
        lineW(3);
        sPol([tapX-30, tapY, tapX+30, tapY, ballX[bnum], ballY[bnum]], "silver");
        sPol([tapX, tapY-30, tapX, tapY+30, ballX[bnum], ballY[bnum]], "lightgray");
        sPol([tapX-30, tapY, tapX, tapY+30, tapX+30, tapY, tapX, tapY-30], "white");
        //どの向きに飛ぶか判るように線を表示
        var dx = ballX[bnum] - tapX;
        var dy = ballY[bnum] - tapY;
        line(ballX[bnum], ballY[bnum], ballX[bnum]+dx, ballY[bnum]+dy, "white");
        if(tapC == 0) {//離した時
            if(tapX < 10 || 1190 < tapX || tapY < 10 || 790 < tapY) {
                drag = 0;//やり直し
            }
            else if(getDis(tapX, tapY, ballX[bnum], ballY[bnum]) < 60) {
                drag = 0;//やり直し
            }
            else {
                ballVx[bnum] = (ballX[bnum] - tapX)/8;
                ballVy[bnum] = (ballY[bnum] - tapY)/8;
                drag = 0;
                bnum = bnum + 1;
                if(bnum == BALL_MAX) bnum = 0;
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
        cursor[i] = "";
    }
}
