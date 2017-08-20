function header(left,mid='',right=''){
  return '<header>'+left+mid+right'</header>';
}
(function(){
	Router = (function(){
		var $router;
		$router = void 0;
		function Router(){
			$router=$('#switchView');
		}

		Router.prototype.page = function(){
		  var tag = (window.location.href.match(/#[a-zA-Z]*/g)==null?null:window.location.href.match(/#[a-zA-Z]*/g)[0].substr(1));
			var text = '';
			var switchView = {
				index:function(){
          let header = header('<label style="color:#000;">首頁</label>');
          let body   = '<article style="background:#fafafa;">'+
                          '<center class="indexCenter">'+
                            '<div style="color:#000; width:80%; text-align:left; margin-top:30px;"></div>'+
                            '<a class="btn btn-g" href="#settings">設定</a>'+
                            '<a class="btn btn-g" href="#record">記錄</a>'+
                            '<a class="btn btn-p" href="#upload">檢視</a>'+
                            '<a class="btn btn-b" href="#view">產出平面、立體圖</a>'+
                            '<a class="btn btn-b" href="#stitch">縫合</a>'+
                          '</center>'+
                        '</article>';
				},
				settings:function(){
				},
				inertia:function(){
				} ,
				record:function(){
				},
        upload:function(){
				},
        view:function(){
        },
        stitch:function(){
        }
			};
			text = (switchView[tag]==undefined?switchView['index']:switchView[tag]);
			$router.fadeOut('slow',function(){
					$router.fadeIn('slow').html(text);
			});
			return true;
		};

		Router.prototype.currentPage = function(){
		    return (window.location.href.match(/#[a-zA-Z]*/g)==null?null:window.location.href.match(/#[a-zA-Z]*/g)[0].substr(1));
		}

		return Router;
	})();
    $(function() {
		window.router = new Router();
	});
}).call(this);

$(document).ready(function(){
    router.page();
});
$(window).on('hashchange', function() {
	router.page();
});
