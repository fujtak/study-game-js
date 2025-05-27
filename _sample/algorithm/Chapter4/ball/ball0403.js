var ballX  = 600;
var ballY  = 400;
var ballVx = 0;
var ballVy = 0;

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
}
