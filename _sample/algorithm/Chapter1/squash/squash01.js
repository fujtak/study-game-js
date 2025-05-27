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
}
