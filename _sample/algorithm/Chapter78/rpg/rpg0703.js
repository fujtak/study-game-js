var scene = 0;
var counter = 0;

function setup() {
    canvasSize(800, 1000);
    var IMG = ["title", "bg"];
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
}

function mainloop() {
    counter++;
    if(scene < 40) {//背景の表示
        drawImgTS(1, 0, 0, 800, 1000, 0, 0, 800, 1000);//居住ドーム
    }
    else {
        drawImgTS(1, 800, 0, 800, 1000, 0, 0, 800, 1000);//探索するドーム
    }
    fText("スペースキーを押してください", 400, 500, 30, "white");

    switch(scene) {
        case 0://タイトル画面
        drawImg(0, 0, 50);//タイトルロゴ
        if(key[32] == 1) {
           key[32] = 2;
            scene = 1;
        }
        break;

        case 1://ホーム画面
        if(key[32] == 1) {
           key[32] = 2;
            scene = 40;
        }
        break;

        case 40://探索画面
        if(key[32] == 1) {
           key[32] = 2;
            scene = 1;
        }
        break;
    }
}
