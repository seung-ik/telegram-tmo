function CComplexFrame(iX, iY, oSprite, oParentContainer, oTextInfo){

    var _bIsLoaded;

    var _iTotalFragment;
    var _iCurFragmentToLoad;
    var _iNumLoadingIteration;

    var _pLabelInfo;

    var _oText;

    var _aFragment;
    
    this._init = function(iX, iY, oSprite, oParentContainer, oTextInfo){
        _bIsLoaded = false;
        
        _iCurFragmentToLoad = 0;
        _iNumLoadingIteration = 5;

        _pLabelInfo = {x:0, y: oSprite.height-LABEL_HEIGHT, width: oSprite.width, height: LABEL_HEIGHT, texty: oSprite.height-LABEL_HEIGHT/2};

        _aFragment = new Array();
        _iTotalFragment = 0;
        for(var i=0; i<oSprite.height; i+=PRECISION){
            
            _aFragment[_iTotalFragment] = new createjs.Container();
            _aFragment[_iTotalFragment].x = iX;
            _aFragment[_iTotalFragment].y = iY;
            _aFragment[_iTotalFragment].regX = oSprite.width/2;
            _aFragment[_iTotalFragment].regY = _iTotalFragment*PRECISION;
            _aFragment[_iTotalFragment].visible = false;

            _iTotalFragment++;
        };
    };
    
    this.getFragments = function(){
        return _aFragment;
    };
    
    this.setText = function(oFragment, szText, iSize, szColor, iOutline, szStrokeColor){      

        _oText = new CTLText(oFragment, 
                    20, 0, oSprite.width-40, iSize, 
                    iSize, "center", szColor, SECONDARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );

    };
    
    this.setLabel = function(oFragment, szText, iSize, szColor){
        
        var oBackPanel = new createjs.Shape();
        oBackPanel.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(_pLabelInfo.x, _pLabelInfo.y, _pLabelInfo.width, _pLabelInfo.height);
        oFragment.addChild(oBackPanel);
        
        _oText = new CTLText(oFragment, 
                    20, _pLabelInfo.texty-10, oSprite.width-40, iSize, 
                    iSize, "center", szColor, SECONDARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );

    };
    
    this.isLoaded = function(){
        return _bIsLoaded;
    };
    
    this.loadFragment = function(){
        if(_iCurFragmentToLoad === _iTotalFragment){
            _bIsLoaded = true;
            return;
        };

        for(var i=0; i<_iNumLoadingIteration; i++){
            
            
            
            var oBg = createBitmap(oSprite);
            _aFragment[_iCurFragmentToLoad].addChild(oBg);


            oParentContainer.addChild(_aFragment[_iCurFragmentToLoad]);

            if(oTextInfo.prize !== null && oTextInfo.prize !== undefined){
                this.setText(_aFragment[_iCurFragmentToLoad], TEXT_CURRENCY + oTextInfo.prize, oTextInfo.size, oTextInfo.color, oTextInfo.stroke, oTextInfo.strokecolor);
            }
            
            if(oTextInfo.label !== null && oTextInfo.label !== undefined && oTextInfo.label !== ""){
                this.setLabel(_aFragment[_iCurFragmentToLoad], oTextInfo.label, 30, "#FFFFFF");
            }
            
            var oBorder = createBitmap(s_oSpriteLibrary.getSprite('borderframe'));
            _aFragment[_iCurFragmentToLoad].addChild(oBorder);
            
            _aFragment[_iCurFragmentToLoad].cache(0,_iCurFragmentToLoad*PRECISION,oSprite.width, PRECISION);
            _iCurFragmentToLoad++;
            

            if(_iCurFragmentToLoad === _iTotalFragment){
                _bIsLoaded = true;
                return;
            };
        }
        
    };
    
    this._init(iX, iY, oSprite, oParentContainer, oTextInfo);
    
}


