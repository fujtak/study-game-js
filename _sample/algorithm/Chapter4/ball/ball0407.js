var ballX  = 600;
var ballY  = 400;
var ballVx = 0;
var ballVy = 0;

var drag = 0;

//起動時の処理
function setup() {
    canvasSize(1200, 800);
    loadImg(0, "image/bg.png");
    loadImg(1, "image/ball0.png");
}

//メインループ
function mainloop() {
    drawImg(0, 0, 0);//背景画像
    drawImgC(1, ballX, ballY);
    myBall();
    moveBall();
}

function moveBall() {//ボールを動かす関数
    ballX = ballX + ballVx;
    ballY = ballY + ballVy;
    if(ballX< 340 && ballVx<0) ballVx = -ballVx;
    if(ballX> 860 && ballVx>0) ballVx = -ballVx;
    if(ballY< 140 && ballVy<0) ballVy = -ballVy;
    if(ballY> 660 && ballVy>0) ballVy = -ballVy;
    ballVx = ballVx * 0.95;
    ballVy = ballVy * 0.95;
}

function myBall() {//ボールを引っ張って飛ばす関数
    if(drag == 0) {//つかむ
        if(tapC == 1 && getDis(tapX, tapY, ballX, ballY) < 60) drag = 1;
    }
    if(drag == 1) {//ひっぱる
        //引く強さが判るように多角形を表示
        lineW(3);
        sPol([tapX-30, tapY, tapX+30, tapY, ballX, ballY], "silver");
        sPol([tapX, tapY-30, tapX, tapY+30, ballX, ballY], "lightgray");
        sPol([tapX-30, tapY, tapX, tapY+30, tapX+30, tapY, tapX, tapY-30], "white");
        //どの向きに飛ぶか判るように線を表示
        var dx = ballX - tapX;
        var dy = ballY - tapY;
        line(ballX, ballY, ballX+dx, ballY+dy, "white");
        if(tapC == 0) {//離した時
            if(getDis(tapX, tapY, ballX, ballY) < 60) {
                drag = 0;//やり直し
            }
            else {
                ballVx = (ballX - tapX)/8;
                ballVy = (ballY - tapY)/8;
                drag = 0;
            }
        }
    }
}
