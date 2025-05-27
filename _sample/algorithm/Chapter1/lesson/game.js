//変数の宣言
var counter = 0;

//起動時の処理
function setup() {
    canvasSize(1200, 800);
    setFPS(60);
}

//メインループ
function mainloop() {
    counter++;
    fill("blue");
    fRect(50, 50, 1100, 700, "navy");
    fText("カウンター "+counter, 600, 400, 36, "white");
}
