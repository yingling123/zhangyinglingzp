/*******轮播效果unslider******/
function imgReload()
{
	var imgHeight = 0;
	var wtmp = $("#floor2_main_right").width();
	$(" #floor2_main_right ul li").each(function(){
        $(this).css({width:wtmp + "px"});
    });
	$(".sliderimg").each(function(){
		$(this).css({width:wtmp + "px"});
		imgHeight = $(this).height();
	});
}
$(window).resize(function(){imgReload();});
$(document).ready(function(e) {
	imgReload();
	floor.init()
    var unslider01= $('#floor2_main_right').unslider({
		speed: 500,              
		delay: 2000, 
		dots: true,
		fluid: true
	}),
	data01 = unslider01.data('unslider');
	$('.unslider-arrow01').click(function() {
        var fn = this.className.split(' ')[1];
        data01[fn]();
    });
	var unslider02= $('#floor_3_right').unslider({
		speed: 500,              
		delay: 2000, 
		dots: true,
		fluid: true
	}),
	data02 = unslider01.data('unslider');
	$('.unslider-arrow01').click(function() {
        var fn = this.className.split(' ')[1];
        data01[fn]();
    });
	
});
/**************/
$("#floor_header>ul>li").hover(
	function(){
		$(this).addClass('hover');
		$(this).find('i').addClass('hover');
	},
	function(){
		$(this).removeClass('hover');
		$(this).find('i').removeClass('hover');
	}
)
function getTop(elem){
  var sum=elem.offsetTop;
  while(elem.offsetParent){
    sum+=elem.offsetParent.offsetTop;
    elem=elem.offsetParent;
  }
  return sum;
}
var floor={
  UPLEVEL:0,//亮灯范围的上线距文档显示区顶部的距离
  DOWNLEVEL:0,//亮灯范围的下线距文档显示区顶部的距离
  distance:0,//保存本次移动的总距离
  DURATION:1000,//保存本次移动的总事件
  STEPS:100,//保存本次移动的总步数
  moved:0,//保存本次已经移动的步数，控制移动结束
  step:0,//保存每步移动的步长
  INTERVAL:0,//保存每步移动的时间间隔
  timer:null,//保存本次移动的序号
  init:function(){
    this.INTERVAL=this.DURATION/this.STEPS;
    var fHeight=
      parseFloat(getComputedStyle($("#floor_1")[0]).height);
    this.UPLEVEL=(window.innerHeight-fHeight)/2;
    this.DOWNLEVEL=this.UPLEVEL+fHeight;
    window.addEventListener(
      "scroll",this.checkLight.bind(this));
    $("#elevator>ul")[0].addEventListener(
      "mouseover",this.showEtitle);
    $("#elevator>ul")[0].addEventListener(
      "mouseout",this.hideEtitle);
    $("#elevator>ul")[0].addEventListener(
      "click",this.move.bind(this));
  },
  move:function(e){//负责准备并启动一个动画
    //如果目标元素是a
    if(e.target.nodeName=="A"){
      if(this.timer!=null){//如果timer不是null
        //停止动画，timer置为null，moved归0
        clearTimeout(this.timer);
        this.timer=null;
        this.moved=0;
      }
      //获得当前网页滚动的scrollTop
      var scrollTop=document.body.scrollTop;
      //获得目标元素的父元素下的第一个a元素的内容，转为整数保存在变量i中
      var i=parseInt(
        e.target.parentNode.firstElementChild.innerHTML);
      //查找id为fi下的header下的span，保存在span中
      var span=$("#floor_"+i+">header>span")[0];
      //获得span距离页面顶部的距离，保存在totalTop中
      var totalTop=getTop(span);
      //计算distance为: totalTop-UPLEVEL-scrollTop
      this.distance=totalTop-this.UPLEVEL-scrollTop;
      //计算step为: distance/STEPS
      this.step=this.distance/this.STEPS;
      //启动一次性定时器，将moveStep作为任务函数，提前绑定this，时间间隔设置为INTERVAL，将序号保存到timer中
      this.timer=setTimeout(
        this.moveStep.bind(this),this.INTERVAL  
      );
    }
  },
  moveStep:function(){
    scrollBy(0,this.step);
    this.moved++;
    if(this.moved<this.STEPS){
      this.timer=setTimeout(
        this.moveStep.bind(this),this.INTERVAL  
      );
    }else{
      clearTimeout(this.timer);
      this.timer=null;
      this.moved=0;
    }
  },
  showEtitle:function(e){//显示当前li下的etitle的a
    var target=e.target;//先获得目标元素target
    //如果target是a,让target变为target的父节点(li)
    target.nodeName=="A"&&(target=target.parentNode);
    if(target.nodeName=="LI"){//如果target是li
      //在target下找第1个a，将其隐藏
      target.firstElementChild.style.display="none";
      //在target下找第2个a，将其显示
      target.lastElementChild.style.display="block";
    }
  },
  hideEtitle:function(e){//隐藏当前li下的etitle的a
    var target=e.target;//先获得目标元素target
    //如果target是a,让target变为target的父节点(li)
    target.nodeName=="A"&&(target=target.parentNode);
    if(target.nodeName=="LI"){//如果target是li
      //获得target下第一个a元素的内容，转为整数，保存在变量i中
      var i=parseInt(
        target.firstElementChild.innerHTML
      );
      var span=document.querySelector("#floor_"+i+">header>span");
      //如果span的class不是hover
      if(span.className!="hover"){
        //在target下找第1个a，将其显示
        target.firstElementChild.style.display="block";
        //在target下找第2个a，将其隐藏
        target.lastElementChild.style.display="none"
      }
    }
  },
  checkLight:function(){
	var scrollTop=document.body.scrollTop;
    var spans=document.querySelectorAll(".floor>header>span");
    for(var i=0;i<spans.length;i++){
      var totalTop=getTop(spans[i]);
      var innerTop=totalTop-scrollTop;
      var lis=document.querySelectorAll("#elevator>ul>li");
	  var li=lis[i];
      var a1=li.firstElementChild;
      var a2=li.lastElementChild; 
      if(innerTop>=this.UPLEVEL&&innerTop<=this.DOWNLEVEL){
        spans[i].className="lf hover";
        a2.className="etitle hover";
        a1.style.display="none";
        a2.style.display="block";
      }else{
        spans[i].className="lf";
		a1.style.display="block";
        a2.style.display="none";
      }
    }
    var lightSpan=document.querySelectorAll(".floor>header>span.hover");
    $("#elevator")[0].style.display=
      lightSpan.length!=0?"block":"none";
  }
}