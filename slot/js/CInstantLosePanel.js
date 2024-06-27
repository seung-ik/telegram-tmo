function CInstantLosePanel(iCurWin){
    
    var _oBg;
    var _oFade;
    var _oGroup;

    var _oMsgText;
    var _oListener;
    
    this._init = function(iCurWin){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
       
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,1)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oGroup.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oSprite.width/2;
        _oBg.regY = oSprite.height/2;
         _oGroup.addChild( _oBg);

        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2), 500, 100, 
                    50, "center", "#fff", THIRD_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
 
    };
    
    this.unload = function(){
        _oGroup.off("click",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("click",this._onExit);
    };
    
    this.show = function(oSprite){
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        _oMsgText.refreshText(TEXT_INSTANT_LOSE);
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});

    };

    
    this._onExit = function(){
        
        if(INSTANT_WHEEL_SETTINGS[iCurWin].redeem_link !== ""){
            window.open(INSTANT_WHEEL_SETTINGS[iCurWin].redeem_link);
        }
        
        _oGroup.off("click",_oListener);
        s_oStage.removeChild(_oGroup);
        $(s_oMain).trigger("end_session");        
        s_oGame.onExit();
    };
    
    this._init(iCurWin);
    
    return this;
}
