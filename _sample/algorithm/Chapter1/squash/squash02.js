//変数の宣言
var ballX = 600;
var ballY = 300;
var ballXp = 10;
var ballYp =  8;

//起動時の処理
function setup() {
    canvasSize(1200, 800);
    lineW(3);
    loadImg(0, "image/bg.png");
}

//メインループ
function mainloop() {
    drawImg(0, 0, 0);//背景画像
    setAlp(50);
    fRect(250, 50, 700, 750, "black");
    setAlp(100);
    sRect(250, 50, 700, 760, "silver");
    ballX = ballX + ballXp;
    ballY = ballY + ballYp;
    if(ballX<=260 || ballX>=940) ballXp = -ballXp;
    if(ballY<= 60 || ballY>=790) ballYp = -ballYp;
    sCir(ballX, ballY, 10, "lime");//ボール
}
