var BALL_MAX = 6;
var ballX  = new Array(BALL_MAX);
var ballY  = new Array(BALL_MAX);
var ballVx = new Array(BALL_MAX);
var ballVy = new Array(BALL_MAX);
var cursor = new Array(BALL_MAX);//カーソル
var life   = new Array(BALL_MAX);//体力

var BALLX  = [350, 450, 550, 850, 750, 650];//┬座標初期値
var BALLY  = [350, 250, 150, 450, 550, 650];//┘
var LIFE   = [160, 100,  80, 200, 120, 100];//体力の最大値
var POWER  = [ 30,  20,  10,  40,  20,  30];//攻撃力

var drag = 0;
var bnum = 0;//操作するボールの番号

var idx = 1;

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

    switch(idx) {
        case 0://動かす順番を決める
        bnum = bnum + 1;
        if(bnum == BALL_MAX) bnum = 0;
        if(life[bnum] > 0) {
            drag = 0;
            idx = 1;
        }
        break;

        case 1://プレイヤーの操作
        if(myBall() == true) idx = 2;
        break;

        case 2://ボールを動かす
        if(moveBall() == BALL_MAX) idx = 0;
        break;
    }
}

function drawBall() {//ボールを描く関数
    for(var i=0; i<BALL_MAX; i++) {//ボールを描く
        if(life[i] == 0) {
            fText("lost.", ballX[i], ballY[i], 40, "silver");
        }
        else {
            drawImgC(i+1, ballX[i], ballY[i]);
            fText(life[i], ballX[i], ballY[i]+24, 24, "lime");
        }
        if(cursor[i] != "") {//カーソル
            lineW(4);
            sRect(ballX[i]-40, ballY[i]-40, 80, 80, cursor[i]);
            cursor[i] = "";
        }
    }
}

function moveBall() {//ボールを動かす関数
    var cnt = 0;
    for(var i=0; i<BALL_MAX; i++) {
        ballX[i] = ballX[i] + ballVx[i];
        ballY[i] = ballY[i] + ballVy[i];
        if(ballX[i]< 340 && ballVx[i]<0) ballVx[i] = -ballVx[i];
        if(ballX[i]> 860 && ballVx[i]>0) ballVx[i] = -ballVx[i];
        if(ballY[i]< 140 && ballVy[i]<0) ballVy[i] = -ballVy[i];
        if(ballY[i]> 660 && ballVy[i]>0) ballVy[i] = -ballVy[i];
        ballVx[i] = ballVx[i] * 0.95;
        ballVy[i] = ballVy[i] * 0.95;
        if(abs(ballVx[i])<1 && abs(ballVy[i])<1) {//長時間、動き続けないように
            ballVx[i] = 0;
            ballVy[i] = 0;
            cnt = cnt + 1;//止まっているボールの数を数える
        }
        if(life[i] == 0) continue;
        for(var j=0; j<BALL_MAX; j++) {//他のボールと衝突したか
            if(i == j) continue;
            if(life[j] > 0 && getDis(ballX[i], ballY[i], ballX[j], ballY[j]) <= 80) {
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
                if(i == bnum) hitBall(i, j);//操作中のボールが、いずれかのボールに当たる
            }
        }
    }
    return cnt;
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
                return true;//飛ばしたらtrueを返す
            }
        }
    }
    return false;
}

function hitBall(n1, n2) {//ボールの衝突時に体力計算を行う関数
    life[n2] -= POWER[n1];
    if(life[n2] < 0) life[n2] = 0;
}

function initVar() {//配列に初期値を代入
    for(var i=0; i<BALL_MAX; i++) {
        ballX[i] = BALLX[i];
        ballY[i] = BALLY[i];
        ballVx[i] = 0;
        ballVy[i] = 0;
        cursor[i] = "";
        life[i] = LIFE[i];
    }
}
