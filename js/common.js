//nav 菜单项
	  $(window).scroll(function(){
	  		var _Top = $(window).scrollTop();
	  		if (_Top>60) {
	  			$(".nav").addClass("navCur");
	  		}
	  		else{
	  			$(".nav").removeClass("navCur");
	  		}
	  });
	  //向上
	  $(window).scroll(function(){
        var sc=$(window).scrollTop();
        var rwidth=$(window).width()+$(document).scrollLeft();
        var rheight=$(window).height()+$(document).scrollTop();
        if(sc>0){
            $("#scoll_top").fadeIn();
        }else{
            $("#scoll_top").fadeOut();
        }
    });
    $(function(){
	    	$("#scoll_top").click(function(){
					$("html, body").animate({ scrollTop: 0 });
				});
    });
    

	  
/*侧边导航栏*/	  
function DirectoryNav($h,config){
        this.opts = $.extend(true,{
            scrollThreshold:0.3,    //滚动检测阀值 0.5在浏览器窗口中间部位
            scrollSpeed:500,        //滚动到指定位置的动画时间
            scrollTopBorder:500,    //滚动条距离顶部多少的时候显示导航，如果为0，则一直显示
            easing: 'swing',        
            delayDetection:100,     //延时检测，避免滚动的时候检测过于频繁
            scrollChange:function(){}
        },config);
        this.$win = $(window);
        this.$h = $h;
        this.$pageNavList = $(".toc");
        this.$pageNavListLis = this.$pageNavList.find("li");
        this.$curTag = this.$pageNavList.find(".cur-tag");
        this.$pageNavListLiH = this.$pageNavListLis.eq(0).height();
        this.offArr = [];
        this.curIndex = 0;
        this.scrollIng = false;
        this.init();
    }

    DirectoryNav.prototype = {
        init:function(){
            this.setArr();
            this.bindEvent();
        },
        setArr:function(){
            var This = this;
            this.$h.each(function(){
                var $this = $(this),
                    offT = Math.round($this.offset().top);
                This.offArr.push(offT);
            });
        },
        posTag:function(top){
            this.$curTag.css({top:top+'px'});
        },
        ifPos:function(st){
//      	console.log(st)
            var offArr = this.offArr;
            //console.log(st);
            var windowHeight = Math.round(this.$win.height() * this.opts.scrollThreshold);
            for(var i=0;i<offArr.length;i++){
                if((offArr[i] - windowHeight) < st) {
                    var $curLi = this.$pageNavListLis.eq(i),
                        tagTop = $curLi.position().top;
                    $curLi.addClass("cur").siblings("li").removeClass("cur");
                    this.curIndex = i;
                    //console.log(tagTop+this.$pageNavListLiH*0.3);
                    this.posTag(tagTop+this.$pageNavListLiH*0.15);
                    //this.curIndex = this.$pageNavListLis.filter(".cur").index();
                    this.opts.scrollChange.call(this);
                }
            }
        },
        bindEvent:function(){
            var This = this,
//              show = false,
                timer = 0;
            this.$win.on("scroll",function(){
                var $this = $(this);
                clearTimeout(timer);
                timer = setTimeout(function(){
                    This.scrollIng = true;
                    if($this.scrollTop()>This.opts.scrollTopBorder){
//                  	console.log(This.opts.scrollTopBorder)
                        if(!This.$pageNavListLiH) This.$pageNavListLiH = This.$pageNavListLis.eq(0).height();
//                      if(!show){
//                          This.$pageNavList.fadeIn();
//                          show = true;
//                      }
                        This.ifPos( $(this).scrollTop() );
                    }
                    else{
                        This.ifPos(6);
                        
                    }
                },This.opts.delayDetection);
            });

            this.$pageNavList.on("click","li",function(){
                var $this = $(this),
                    index = $this.index();
                This.scrollTo(This.offArr[index]-125);
            })
        },
        scrollTo: function(offset,callback) {
        	console.log(offset)
            var This = this;
            $('html,body').animate({
                scrollTop: offset
            }, this.opts.scrollSpeed, this.opts.easing, function(){
                This.scrollIng = false;
                //修正弹两次回调
                callback && this.tagName.toLowerCase()=='body' && callback();
            });
        }
    };