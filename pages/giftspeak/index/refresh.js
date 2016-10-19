 function refresh(){
    this.page;            		//页面
    this.pull = true;           //可以下拉刷新
    this.uppull = false;		//开始不可以上拉加载
    
    this.downPullShowText = ['下拉刷新', '松开刷新'];
    this.upPullShowText = ['加载更多', '加载更多'];
    
    this.headHeight = -40;      //hede高度
    this.footHeight = 0;      //hede高度
    
    this.head = {
    	place: -40,				//相对与没有做任何位置处理时偏移的距离  （初始隐藏 顶部）
    	deviation:40,			//相对于偏移后的位置的偏移距离     （ 下拉到一定高度才会刷新 ）
    	showtext: ['下拉刷新', '松开刷新']
    }
    this.foot = {
    	place: 0,
    	deviation:0,
    	showtext:['加载更多', '加载更多']
    }
    
    this.scrollend = true;      //scroll滚动结束
    this.touchend = true;       //touch事件结束
    this.timer = null;          //回到初始状态的定时器
    this.pageStartY = 0;        //滑动开始的位置
	this.scrollStartX = 0;

    this.init = function(page,option){
		
		this.down = option.down;
		this.up = option.up;
		
        page.refresh = this;
        page.refreshscroll =  function( e ){ page.refresh.scroll(e); }
        page.refreshToupper = function(e){page.refresh.toupper(e); }
        page.refreshTolower = function(e){page.refresh.tolower( e);}
        page.refreshtouchStart =function( e ){ page.refresh.touchStart(e); } 
        page.refreshtouchMove =function( e ){ page.refresh.touchMove(e); } 
        page.refreshtouchEnd = function( e ){ page.refresh.touchEnd(e); }
        
        page.setData({
        	margintop: -40,
        	marginbottom: -40,
        	downpullrefresh: false,
        	uppullrefresh:true
        });
        
        this.page = page;
    }
}

var fangxiang ;     //方向
var startfangxiang;
var touch = 'end';          //touch事件    start
var startY;            //事件开始时候的Y
var down = true; 
var scrollHeight;


refresh.prototype = {

    //  判断方向
    direction:function( e ){
        if( touch == "start" ){
             touch = "move";
            if( startY < e.touches[0].clientY ){
                return "down";
            }else{
                return "up";
            }
        } 
    },
	scroll:function(e){
		if( touch == "end"  ){
			scrollHeight = e.detail.scrollHeight;	
		}
        // console.log("scollTop : "+ scrollHeight);
	},
	hide:function(key){
		var obj ={};
		obj[key] = true;
		this.page.setData(obj);
	},
	show:function(key){
		var obj ={};
		obj[key] = false;
		this.page.setData(obj);
		// console.log(  "show");
	},
	toupper: function(){
		this.pull = true;
		this.show('downpullrefresh');
		// console.log(  "toupper");
	},
	tolower:function(e){
		this.uppull = true;
		this.show('uppullrefresh');	
		
		// console.log( this.uppull,"tolower");
	},
	touchStart:function(e){
        if( touch == 'end'){
            touch = "start";
	        startY =   e.touches[0].clientY;
        }
        
//	    console.log( "statr" );
	},
	move: function(e, upAnddowm , bully){
    	//bully  对象
    	if( this.page.data[upAnddowm] > bully.place + bully.deviation ){
            this.page.setData({
                pullrefreshtext:bully.showtext[1]
            });
        }else{
            this.page.setData({
                pullrefreshtext:bully.showtext[0]
            });
        }
        var dy = parseInt( ( e.touches[0].clientY -startY)/1);
        var obj = {};
        obj[upAnddowm] = bully.place + dy;
    	this.page.setData(obj);
    },
    touchMove: function(e){
        if(!fangxiang ){
            fangxiang = this.direction( e );
        }
         
         
        // console.log( fangxiang , this.pull , touch , this.uppull);
       if( fangxiang == "down"){
       		if( this.uppull ){
       			this.uppull = false;
				this.hide('uppullrefresh');	
       		}
            if(down && this.pull && touch == "move" ){
                this.move(e,'margintop', this.head);
            }
       }else if(fangxiang == "up"){
       		if( this.pull){
       			this.pull = false;
            	this.hide('downpullrefresh');	
       		}
            if(this.uppull && touch == "move"){
            	this.move(e,'marginbottom', this.foot);
            }
       };
		
        // console.log("move");
	},
    touchEnd:function(e){
       var self = this;
       if( touch == "move" && this.pull  && fangxiang=="down"){
            this.reduction(self, 'margintop', this.head, fangxiang);
       } else if( touch == "move" && this.uppull  && fangxiang=="up" ){
            this.reduction(self,'marginbottom', this.foot, fangxiang);
       }
		
		fangxiang = false;
    	touch = "end";
        // console.log( 'end');
    },
    reduction: function(self,upAnddowm, bully,fangxiang){
    	
    	var fx = fangxiang;
    	var self = self;
    	var isre = false;
    	var current ;
    	
    	clearInterval(self.timer);
    	
		
    	if(fx == "down" ){
    		var updown = self.page.data[upAnddowm];
    		current = this.down;

    	} else if(fx == "up"){
    		var updown = -self.page.data[upAnddowm];
    		current = this.up;
    	}
		console.log( '>>>>>  找到位置为 '+ fx );
    	
    	
    	if(  updown >= bully.place + bully.deviation){
    		
    		//刷新操作
    		isre = true;
    		self.page.setData({
                pullrefreshtext:'正在刷新...'
            });
    		
    		console.log( '>>>>>  开始请求数据' );
			wx.request({
				url: current.url,
				header:{
					"Content-Type":"application/json"
				},
				success: function(res) {
					
					console.log( '>>>>>>  请求数据成功 --->设置view文字提示' );
					self.page.setData({
		                pullrefreshtext:'刷新成功...'
		            });
					
					console.log( '>>>>>>  请求数据成功 --->执行回调函数' );
					current.success(res);
					
					console.log( '>>>>>>  请求数据成功 --->设置倒计时为0---> 执行 view 隐藏' );
					clearInterval(self.timer);
	    			setTimeout(function(){
	    				var obj ={};
	    				if(current == self.down ){
	    					obj[upAnddowm] = bully.place;
	    					self.page.setData(obj);
	    				}else if(current == self.up  ){
	    					var top = scrollHeight - 60 +  parseInt( Math.random()*10);
	    					console.log( '>>>>>>  滚动到局底部400的地方', top);
	    					
							setTimeout(function(){
								self.page.setData({
					                scrollTop: top
					            });	
							},200);
	    				}
	    			},0);
				}
			});
    		
    	}
    	
    	
    	console.log( '>>>>>>  执行回到初始状态 动画 的定时器' );
    	console.log( '>>>>>>  动画开始' );
        self.timer = setInterval(function(  ){
        	var newmargin = parseInt( (self.page.data[upAnddowm] - bully.place) - (self.page.data[upAnddowm] -bully.place) *1/9);
            var obj = {};
            
            if(  Math.abs( newmargin) <= 1 || newmargin < bully.deviation  ){
            	console.log( '>>>>>>  动画结束' );
                clearInterval(self.timer);
                if( newmargin < bully.deviation  ){
                	console.log( '>>>>>>  等待数据请求完成' );
                	obj[upAnddowm] = bully.place + bully.deviation;
                }else{
                	console.log( '>>>>>>  隐藏 刷新信息 view' );
                	obj[upAnddowm] = bully.place;
                }
            }else{
            	obj[upAnddowm] = newmargin+bully.place;
            }
            self.page.setData(obj);
        },10);
    	
    }
}



module.exports = new refresh();