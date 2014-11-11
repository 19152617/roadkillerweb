var res = {
        Car_png: "res/car.png",
        PlayBG_png: "res/PlayBG.png",
        turnLeft_n_png: "res/turn_left_n.png",
        turnLeft_s_png: "res/turn_left_s.png",
        turnRight_n_png: "res/turn_right_n.png",
        turnRight_s_png: "res/turn_right_s.png",
        accelerator_n_png: "res/accelerator_n.png",
        accelerator_s_png: "res/accelerator_s.png",
        brake_n_png: "res/brake_n.png",
        brake_s_png: "res/brake_s.png",
        light_left_png: "res/light_left.png",
        light_right_png: "res/light_right.png",
        light_run_png: "res/light_run.png",
        light_stop_png: "res/light_stop.png",
        score_bg_png: "res/scoreBG.png",
        time_bg_png: "res/timeBG.png",
        tip_right_png: "res/tip_right.png",
        tip_wrong_png: "res/tip_wrong.png"
    },
    g_resources = [],
    i;
for (i in res) g_resources.push(res[i]);
var PlayScene = cc.Scene.extend({
    roadLayer: null,
    carLayer: null,
    controlLayer: null,
    startLayer: null,
    lightLayer: null,
    statusLayer: null,
    actionId: null,
    actions: ["left", "right", "run", "stop"],
    intervalTimer: null,
    timeoutTimer: null,
    onEnter: function() {
        this._super();
        this.addChild(this.roadLayer = new RoadLayer, 0, 0);
        this.addChild(this.carLayer = new CarLayer, 0, 1);
        this.addChild(this.controlLayer = new ControlLayer, 0, 2);
        this.addChild(this.startLayer = new StartLayer, 0, 3);
        this.addChild(this.lightLayer = new LightLayer, 0, 4);
        this.addChild(this.statusLayer =
            new StatusLayer, 0, 5);
        this.addChild(this.tipLayer = new TipLayer, 0, 6)
    },
    start: function() {
        this.test();
        this.startTest();
        this.statusLayer.start()
    },
    startTest: function() {
        this.intervalTimer = setInterval(this.test.bind(this), 2E3)
    },
    stopTest: function() {
        clearInterval(this.intervalTimer);
        clearTimeout(this.timeoutTimer);
        this.lightLayer.hideLight()
    },
    test: function() {
        this.actionId = generator.getNextTest();
        this.lightLayer.showLight(this.actions[this.actionId]);
        this.timeoutTimer = setTimeout(this.testWrong.bind(this), 1E3)
    },
    receiveTest: function(a) {
        null != this.actionId && (a === this.actionId ? (this.actionId = null, this.testRight(a)) : (this.actionId = null, this.testWrong()))
    },
    testWrong: function() {
        clearTimeout(this.timeoutTimer);
        generator.receiveTest(!1);
        this.lightLayer.hideLight();
        this.statusLayer.wrong();
        this.tipLayer.showWrong()
    },
    testRight: function(a) {
        clearTimeout(this.timeoutTimer);
        generator.receiveTest(!0);
        this.lightLayer.hideLight();
        this.action(a);
        this.statusLayer.right();
        this.tipLayer.showRight()
    },
    action: function(a) {
        switch (a) {
            case 0:
                this.carLayer.moveLeft();
                break;
            case 1:
                this.carLayer.moveRight();
                break;
            case 2:
                this.roadLayer.start();
                break;
            case 3:
                this.roadLayer.stop()
        }
    },
    gameOver: function() {
        this.stopTest();
        this.roadLayer.stop();
        cc.game.score = this.statusLayer.getScore()
    }
});
var RoadLayer = cc.Layer.extend({
    roads: [],
    roadHeight: 0,
    roadIdx: 0,
    ctor: function() {
        this._super();
        this.createRoads()
    },
    createRoads: function() {
        for (var a = 0; this.createRoad(a++););
    },
    createRoad: function(a) {
        var b = new cc.Sprite(res.PlayBG_png),
            c, d = cc.winSize;
        0 === a && (c = b.getBoundingBox(), this.roadHeight = c.height);
        b.attr({
            x: 0,
            y: a * this.roadHeight,
            anchorX: 0,
            anchorY: 0
        });
        this.roads.push(b);
        this.addChild(b);
        return b.y < d.height
    },
    updateRoads: function() {
        this.roads.forEach(function(a, b) {
            a.attr({
                y: a.y -= 40
            });
            a.y <= -this.roadHeight &&
            a.attr({
                y: (this.roads.length - 1) * this.roadHeight
            })
        }.bind(this))
    },
    update: function() {
        this.updateRoads()
    },
    start: function() {
        this.scheduleUpdate()
    },
    stop: function() {
        this.unscheduleUpdate()
    }
});
var CarLayer = cc.Layer.extend({
    carSprite: null,
    leftAction: null,
    rightAction: null,
    centerAction: null,
    pos: 1,
    ctor: function() {
        this._super();
        this.createCar();
        this.createActions()
    },
    createCar: function() {
        var a = this.carSprite = new cc.Sprite(res.Car_png),
            b = cc.winSize;
        a.attr({
            x: b.width / 2,
            y: b.height / 2
        });
        this.addChild(a)
    },
    createActions: function() {
        var a = cc.winSize;
        this.leftAction = new cc.moveTo(0.4, a.width / 4, a.height / 2);
        this.rightAction = new cc.moveTo(0.4, a.width / 4 * 3, a.height / 2);
        this.centerAction = new cc.moveTo(0.4, a.width /
        2, a.height / 2)
    },
    resume: function() {
        this.carSprite.attr({
            x: cc.winSize.width / 2
        })
    },
    move: function(a) {
        this.carSprite.runAction(a)
    },
    moveLeft: function() {
        2 === this.pos ? this.moveCenter() : (this.pos = 0, this.move(this.leftAction))
    },
    moveRight: function() {
        0 === this.pos ? this.moveCenter() : (this.pos = 2, this.move(this.rightAction))
    },
    moveCenter: function() {
        this.pos = 1;
        this.move(this.centerAction)
    }
});
var ControlLayer = cc.Layer.extend({
    speed: 10,
    ctor: function() {
        this._super();
        this.createMenu()
    },
    createMenu: function() {
        this.createMenuItem(res.turnLeft_n_png, res.turnLeft_s_png, cc.p(100, 155), this.turnLeft);
        this.createMenuItem(res.turnRight_n_png, res.turnRight_s_png, cc.p(350, 155), this.turnRight);
        this.createMenuItem(res.accelerator_n_png, res.accelerator_s_png, cc.p(100, 35), this.accelerator);
        this.createMenuItem(res.brake_n_png, res.brake_s_png, cc.p(350, 35), this.brake)
    },
    createMenuItem: function(a, b, c, d) {
        a = new cc.MenuItemSprite(new cc.Sprite(a),
            new cc.Sprite(b), d, this);
        b = new cc.Menu(a);
        a.setAnchorPoint(0, 0);
        b.setPosition(c);
        this.addChild(b)
    },
    turnLeft: function() {
        this.getParent().receiveTest(0)
    },
    turnRight: function() {
        this.getParent().receiveTest(1)
    },
    accelerator: function() {
        this.getParent().receiveTest(2)
    },
    brake: function() {
        this.getParent().receiveTest(3)
    }
});
var StartLayer = cc.Layer.extend({
    countdownTxt: ["3", "2", "1", "GO"],
    countdownIdx: 0,
    countdownActions: [],
    ctor: function() {
        this._super();
        this.init();
        this.schedule(this.countdown, 1, 4, 0)
    },
    init: function() {
        this._super();
        var a = cc.winSize;
        this.label = new cc.LabelTTF("READY", "Helvetica", 150);
        this.label.setColor(cc.color(255, 255, 0));
        this.label.setPosition(a.width / 2, a.height / 2);
        this.addChild(this.label);
        this.createActions()
    },
    createActions: function() {
        this.countdownActions.push(new cc.ScaleTo(0.2, 1));
        this.countdownActions.push(new cc.FadeTo(0.3,
            255))
    },
    countdown: function() {
        var a = this.countdownTxt[this.countdownIdx++];
        this.label.setScale(100);
        this.label.setOpacity(0);
        a ? (this.label.setString(a), this.countdownActions.forEach(function(a) {
            this.label.runAction(a)
        }.bind(this))) : (this.unschedule(), this.getParent().start())
    }
});
var LightLayer = cc.Layer.extend({
    left: null,
    right: null,
    run: null,
    stop: null,
    current: null,
    ctor: function() {
        this._super();
        this.createLights()
    },
    createLights: function() {
        var a = [res.light_left_png, res.light_right_png, res.light_run_png, res.light_stop_png];
        ["left", "right", "run", "stop"].forEach(function(b, c) {
            this.createLight(b, a[c])
        }.bind(this))
    },
    createLight: function(a, b) {
        var c = cc.winSize;
        (this[a] = new cc.Sprite(b)).attr({
            x: c.width / 2,
            y: 720
        })
    },
    showLight: function(a) {
        this.hideLight();
        this.addChild(this[this.current =
            a])
    },
    hideLight: function() {
        this.current && (this.removeChild(this[this.current]), this.current = null)
    }
});
var generator = function() {
    function a(b, d, e) {
        var f;
        if ("number" === typeof e)
            for (;
                (f = a(b, d)) !== e;);
        else f = Math.floor(Math.random() * (d - b + 1) + b);
        return f
    }

    function b() {
        this.reset()
    }
    b.prototype = {
        constructor: b,
        getNextMove: function() {
            var b;
            switch (this.pos) {
                case 0:
                    this.posTarget = b = 1;
                    break;
                case 1:
                    b = a(0, 1);
                    this.posTarget = 0 === b ? 0 : 2;
                    break;
                case 2:
                    b = 0, this.posTarget = 1
            }
            return b
        },
        getNextAction: function() {
            return this.running ? a(0, 1) : 2
        },
        getNextTest: function() {
            var a;
            switch (this.getNextAction()) {
                case 0:
                    a = this.getNextMove();
                    break;
                case 1:
                    this.runningTarget = !1;
                    a = 3;
                    break;
                case 2:
                    this.runningTarget = !0, a = 2
            }
            return a
        },
        receiveTest: function(a) {
            a ? (this.running = this.runningTarget, this.pos = this.posTarget) : (this.runningTarget = this.running, this.posTarget = this.pos)
        },
        reset: function() {
            this.running = this.runningTarget = !1;
            this.pos = this.posTarget = 1
        }
    };
    return new b
}();
var StatusLayer = cc.Layer.extend({
    score: 0,
    time: 60,
    scoreLabel: null,
    timeLabel: null,
    fontDef: null,
    interval: null,
    ctor: function() {
        this._super();
        this.fontDef = new cc.FontDefinition;
        this.fontDef.fontName = "\u9ed1\u4f53";
        this.fontDef.fontSize = "28";
        this.createLabels()
    },
    parseTemp: function(a, b) {
        return a.replace(this.reg, b)
    },
    createLabels: function() {
        this.createLabelBg();
        var a;
        this.createLabel("\u5f53\u524d\u5f97\u5206:", 40, 860);
        this.createLabel("\u5206", 305, 860);
        this.scoreLabl = a = new cc.LabelTTF(this.score.toString(),
            "Helvetica", 34, cc.size(100, 32), cc.TEXT_ALIGNMENT_RIGHT);
        a.setAnchorPoint(0, 0);
        a.setColor(cc.color(255, 0, 0));
        a.setPosition(195, 865);
        this.addChild(a);
        this.createLabel("\u5012\u8ba1\u65f6:", 407, 860);
        this.createLabel("\u79d2", 570, 860);
        this.timeLabel = a = new cc.LabelTTF(this.time.toString(), "Helvetica", 34, cc.size(70, 32), cc.TEXT_ALIGNMENT_RIGHT);
        a.setAnchorPoint(0, 0);
        a.setColor(cc.color(255, 0, 0));
        a.setPosition(490, 865);
        this.addChild(a)
    },
    createLabel: function(a, b, c) {
        a = new cc.LabelTTF(a, this.fontDef);
        a.setAnchorPoint(0,
            0);
        a.setColor(cc.color(255, 255, 255));
        a.setPosition(b, c);
        this.addChild(a)
    },
    createLabelBg: function() {
        var a = new cc.Sprite(res.score_bg_png);
        a.setAnchorPoint(0, 0);
        a.attr({
            x: 28,
            y: 840
        });
        this.addChild(a);
        a = new cc.Sprite(res.time_bg_png);
        a.setAnchorPoint(0, 0);
        a.attr({
            x: 395,
            y: 840
        });
        this.addChild(a)
    },
    right: function() {
        this.score += 10
    },
    wrong: function() {
        this.score -= 20;
        0 > this.score && (this.score = 0)
    },
    update: function() {
        this.scoreLabl.setString(this.score.toString());
        this.timeLabel.setString(this.time.toString())
    },
    start: function() {
        this.interval = setInterval(this.updateTime.bind(this), 1E3);
        this.scheduleUpdate()
    },
    updateTime: function() {
        this.time--;
        0 === this.time && (clearInterval(this.interval), this.getParent().gameOver())
    },
    getScore: function() {
        return this.score
    },
    restart: function() {
        this.time = 10;
        this.score = 0
    }
});
var TipLayer = cc.Layer.extend({
    rightTip: null,
    wrongTip: null,
    ctor: function() {
        this._super();
        this.createTips()
    },
    createTips: function() {
        this.rightTip = this.createTip(res.tip_right_png);
        this.wrongTip = this.createTip(res.tip_wrong_png)
    },
    createTip: function(a) {
        a = new cc.Sprite(a);
        a.setPosition(cc.winSize.width / 2, 720);
        a.setOpacity(0);
        this.addChild(a);
        return a
    },
    showTip: function(a) {
        var b = a ? this.rightTip : this.wrongTip;
        b.setOpacity(255);
        setTimeout(function() {
            b.setOpacity(0)
        }.bind(this), 500)
    },
    showRight: function() {
        this.showTip(!0)
    },
    showWrong: function() {
        this.showTip(!1)
    }
});/*
cc.game.onStart = function() {
    cc.view.adjustViewPort(!0);
    cc.view.setDesignResolutionSize(640, 940, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(!0);
    cc.LoaderScene.preload(g_resources, function() {
        cc.director.runScene(new PlayScene)
    }, this)
};
cc.game.onStop = function() {
    alert("Game Over")
};
cc.game.run();*/