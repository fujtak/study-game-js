var ballX  = 600;
var ballY  = 400;
var ballVx = 16;
var ballVy = 8;

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
    moveBall();
}

function moveBall() {//ボールを動かす関数
    ballX = ballX + ballVx;
    ballY = ballY + ballVy;
    if(ballX< 340 && ballVx<0) ballVx = -ballVx;
    if(ballX> 860 && ballVx>0) ballVx = -ballVx;
    if(ballY< 140 && ballVy<0) ballVy = -ballVy;
    if(ballY> 660 && ballVy>0) ballVy = -ballVy;
}
