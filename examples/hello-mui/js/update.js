(function(w){
	var server="http://www.dcloud.io/hellomui/update.json",//获取升级描述文件服务器地址
	localDir="update",localFile="update.json",//本地保存升级描述目录和文件名
	keyUpdate="updateCheck",//取消升级键名
	keyAbort="updateAbort",//忽略版本键名
	checkInterval=3600000,//升级检查间隔，单位为ms,1小时为60*60*1000=3600000, 如果每次启动需要检查设置值为0
	dir=null;

	/**
	 * 准备升级操作
	 * 创建升级文件保存目录
	 */
	function initUpdate(){
		// 打开doc根目录
		plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function(fs){
			fs.root.getDirectory( localDir, {create:true}, function(entry){
				dir = entry;
				checkUpdate();
			}, function(e){
				console.log( "准备升级操作，打开update目录失败："+e.message );
			});
		},function(e){
			console.log( "准备升级操作，打开doc目录失败："+e.message );
		});
	}

	/**
	 * 检测程序升级
	 */
	function checkUpdate() {
		// 判断升级检测是否过期
		var lastcheck = plus.storage.getItem( keyUpdate );
		if ( lastcheck ) {
			var dc = parseInt( lastcheck );
			var dn = (new Date()).getTime();
			if ( dn-dc < checkInterval ) {	// 未超过上次升级检测间隔，不需要进行升级检查
				return;
			}
			// 取消已过期，删除取消标记
			plus.storage.removeItem( keyUpdate );
		}
		// 读取本地升级文件
		dir.getFile( localFile, {create:false}, function(fentry){
			fentry.file( function(file){
				var reader = new plus.io.FileReader();
				reader.onloadend = function ( e ) {
					fentry.remove();
					var data = null;
					try{
						data=JSON.parse(e.target.result);
					}catch(e){
						console.log( "读取本地升级文件，数据格式错误！" );
						return;
					}
					checkUpdateData( data );
				}
				reader.readAsText(file);
			}, function(e){
				console.log( "读取本地升级文件，获取文件对象失败："+e.message );
				fentry.remove();
			} );
		}, function(e){
			// 失败表示文件不存在，从服务器获取升级数据
			getUpdateData();
		});
	}

	/**
	 * 检查升级数据
	 */
	function checkUpdateData( j ){
		//当前客户端版本号
		var curVer=plus.runtime.version,
		
		inf = j[plus.os.name];
		if ( inf ){
			var srvVer = inf.version;
			// 判断是否存在忽略版本号
			var vabort = plus.storage.getItem( keyAbort );
			if ( vabort && srvVer==vabort ) {
				// 忽略此版本
				return;
			}
			// 判断是否需要升级
			if ( compareVersion(curVer,srvVer) ) {
				// 提示用户是否升级
				plus.ui.confirm( inf.note, function(i){
					if ( 0==i ) {
						plus.runtime.openURL( inf.url );
					} else if ( 1==i ) {
						plus.storage.setItem( keyAbort, srvVer );
						plus.storage.setItem( keyUpdate, (new Date()).getTime().toString() );
					} else {
						plus.storage.setItem( keyUpdate, (new Date()).getTime().toString() );
					}
				}, inf.title, ["立即更新","跳过此版本","取　　消"] );
			}
		}
	}
	
	/**
	 * 从服务器获取升级数据，并存储到本地；
	 */
	function getUpdateData(){
		mui.getJSON(server,{},function (data) {
			//appid一致，才将服务器上的版本数据保存到本地
			if(data.appid==plus.runtime.appid){
				// 保存到本地文件中
	            	dir.getFile( localFile, {create:true}, function(fentry){
	            		fentry.createWriter( function(writer){
	            			writer.onerror = function(){
	            				console.log( "获取升级数据，保存文件失败！" );
	            			}
	            			writer.write(data);
	            		}, function(e){
	            			console.log( "获取升级数据，创建写文件对象失败："+e.message );
	            		} );
	            	}, function(e){
	            		console.log( "获取升级数据，打开保存文件失败："+e.message );
	            	});
			}
		});
	}
	
	/**
	 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
	 * @param {String} ov
	 * @param {String} nv
	 * @return {Boolean} 
	 */
	function compareVersion( ov, nv ){
		if ( !ov || !nv || ov=="" || nv=="" ){
			return false;
		}
		var b=false,
		ova = ov.split(".",4),
		nva = nv.split(".",4);
		for ( var i=0; i<ova.length&&i<nva.length; i++ ) {
			var so=ova[i],no=parseInt(so),sn=nva[i],nn=parseInt(sn);
			if ( nn>no || sn.length>so.length  ) {
				return true;
			} else if ( nn<no ) {
				return false;
			}
		}
		if ( nva.length>ova.length && 0==nv.indexOf(ov) ) {
			return true;
		}
	}
		
	mui.plusReady(initUpdate);

})(window);