function CInstantWinPanel(iCurWin) {
  var _oBg;
  var _oFade;
  var _oGroup;

  var _oMsgText;
  var _oButRedeem;
  var _oListener;

  this._init = function (iCurWin) {
    _oGroup = new createjs.Container();
    _oGroup.alpha = 0.01;
    _oGroup.visible = false;
    s_oStage.addChild(_oGroup);

    _oFade = new createjs.Shape();
    _oFade.graphics
      .beginFill("rgba(0,0,0,1)")
      .drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oFade.alpha = 0;
    _oGroup.addChild(_oFade);
    createjs.Tween.get(_oFade).to({ alpha: 0.7 }, 500);

    var oSprite = s_oSpriteLibrary.getSprite("msg_box");
    _oBg = createBitmap(oSprite);
    _oBg.x = CANVAS_WIDTH / 2;
    _oBg.y = CANVAS_HEIGHT / 2;
    _oBg.regX = oSprite.width / 2;
    _oBg.regY = oSprite.height / 2;
    _oGroup.addChild(_oBg);

    _oMsgText = new CTLText(
      _oGroup,
      CANVAS_WIDTH / 2 - 250,
      CANVAS_HEIGHT / 2 - 80,
      500,
      80,
      40,
      "center",
      "#fff",
      THIRD_FONT,
      1,
      0,
      0,
      " ",
      true,
      true,
      true,
      false
    );

    var oControllerContainer = new createjs.Container();
    oControllerContainer.x = CANVAS_WIDTH / 2;
    oControllerContainer.y = 730;
    _oGroup.addChild(oControllerContainer);

    var oSprite = s_oSpriteLibrary.getSprite("but_long_text");
    _oButRedeem = new CTextButton(
      0,
      0,
      oSprite,
      TEXT_REDEEM,
      THIRD_FONT,
      "#ffffff",
      60,
      true,
      oControllerContainer
    );
    _oButRedeem.addEventListener(ON_MOUSE_UP, this._onButRedeem, this);
    _oButRedeem.enable();

    this._initListener();
  };

  this.unload = function () {
    _oGroup.off("mousedown", _oListener);
  };

  this._initListener = function () {
    _oListener = _oGroup.on("mousedown", function () {});
  };

  this.show = function (oSprite) {
    $(s_oMain).trigger("show_interlevel_ad");

    _oMsgText.refreshText(TEXT_INSTANT_WIN);

    _oGroup.visible = true;

    var oParent = this;
    createjs.Tween.get(_oGroup).to({ alpha: 1 }, 500);
  };

  this._onButRedeem = function () {
    var oParent = this;
    oParent._onExit();
    // window.open(INSTANT_WHEEL_SETTINGS[iCurWin].redeem_link); // CHECK: 링크로 이동 하는 버튼 기능 없앰
  };

  this._onExit = function () {
    _oGroup.off("mousedown", _oListener);
    s_oStage.removeChild(_oGroup);
    $(s_oMain).trigger("end_session");
    s_oGame.onExit();
  };

  this._init(iCurWin);

  return this;
}
