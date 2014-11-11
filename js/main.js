(function () {
    function openMessage () {
        var _p = this.getAttribute('_p'),
            _t = this.getAttribute('_t');
        if(_p) {
            document.querySelector('#' + _p).style.display = 'none';
        }
        if(_t) {
            document.querySelector('#' + _t).style.display = 'block';
        }
    }
    function bindA () {
        var as = document.querySelectorAll('a'),
            aLength = as.length;
        for(var i = 0; i < aLength; i ++) {
            var a = as[i];
            a.addEventListener('click',function  (a) {
                return function (argument) {
                    openMessage.apply(a);
                }
            }(a),false);
        }
    }

    var loading, main, prize, game;
    function pageInit() {
        loading = document.querySelector('.loading');
        main = document.querySelector('.main');
        prize = document.querySelector('.prizeDetail');
        game = document.querySelector('.game');

        onLoaded();

        document.querySelector('#btnStartGame').addEventListener('click', function (evt) {
            startGame();
        }, false);
    }

    function onLoaded() {
        main.style.display = 'block';
        loading.style.display = 'none';
    }

    function startGame() {
        main.style.display = 'none';
        game.style.display = 'block';
        runGame();
    }

    function gameOver (score) {

    }

    function runGame() {
        cc.game.onStart = function(){
            var size = cc.winSize;
            cc.view.adjustViewPort(true);
            cc.view.setDesignResolutionSize(640, 940, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);
            //load resources
            cc.LoaderScene.preload(g_resources, function () {
                //cc.director.runScene(new Helloproject.jsonWorldScene());
                cc.director.runScene(new PlayScene());
            }, this);
        };
        cc.game.onStop = function () {
            gameOver(cc.game.score);
        };
        cc.game.run();
    }

    window.addEventListener('load', function () {
        bindA();
        pageInit();
    }, false);
})();