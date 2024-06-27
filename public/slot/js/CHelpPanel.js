function CHelpPanel(){
    var _oText1;
    var _oText2; 

    var _oFade;
    var _oHelpBg;
    var _oGroup;
    var _oParent;
    var _oListener;

    this._init = function(){
        var oParent = this;
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,1)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        _oGroup.addChild(_oFade);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oHelpBg = createBitmap(oSprite);
        _oHelpBg.x = CANVAS_WIDTH/2;
        _oHelpBg.y = CANVAS_HEIGHT/2;
        _oHelpBg.regX = oSprite.width/2;
        _oHelpBg.regY = oSprite.height/2;
        _oGroup.addChild( _oHelpBg);

        var oText1Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2) - 100};

  
        _oText1 = new CTLText(_oGroup, 
                    oText1Pos.x-250, oText1Pos.y, 500, 40, 
                    20, "center", "#fff", THIRD_FONT, 1,
                    0, 0,
                    TEXT_HELP3,
                    true, true, true,
                    false );
           

        var oControllerContainer = new createjs.Container();
        oControllerContainer.x = 260;
        oControllerContainer.y = 670;
        _oGroup.addChild( oControllerContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_spin');
        var oButSpin = new CTextButton(0,0,oSprite,TEXT_SPIN,THIRD_FONT,"#ffffff",60, false, oControllerContainer);
        oButSpin.enable();
        oButSpin.setClickable(false);
        
        var oSprite = s_oSpriteLibrary.getSprite('swipe_hand');
        var oSwipe = createBitmap(oSprite);
        oSwipe.x = 500;
        oSwipe.y = CANVAS_HEIGHT/2;
        oSwipe.regX = oSprite.width/2;
        oSwipe.regY = oSprite.height/2;
        _oGroup.addChild( oSwipe);
        
        createjs.Tween.get(oSwipe, {loop:true}).to({y:CANVAS_HEIGHT/2 +30}, 1000, createjs.Ease.cubicOut);

        var oText2Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2)+130};
  
        _oText2 = new CTLText(_oGroup, 
                    oText2Pos.x-250, oText2Pos.y, 500, 40, 
                    20, "center", "#fff", THIRD_FONT, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );


        
        _oListener = _oGroup.on("pressup",function(){oParent._onExitHelp();});
     
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup",_oListener);
    };

    this._onExitHelp = function(){
        _oParent.unload();

    };

    _oParent=this;
    this._init();

}
