;(function(){
	var pageDefaults = {
		dataLen: 0
		,btnLoc: null//生成按钮的位置，需要传入一个位置元素
		,btnNum: 7//带有数字序号的页码按钮数量
		,pageRows: 10//items per page
		,pageIdx: 0//被显示的当前页页码
		,customFill: function() {
			alert('define a fill function!');
		}
	};

	var MSG = {
		jumptoPage: "跳转到"
		,pageRangeErr: "不存在此页"
	};

	function Page(selfConfig) {
		var defaults = {
			pageLen: 1//总页码数
			,pContentArr: []//用来放置分页显示起始和结束数据idx的二维数组
		};
		this.defaults = $.extend(defaults, pageDefaults, selfConfig);
	}
	Page.prototype.createPageBtn = function() {
		var btns = document.createDocumentFragment(),
			a = null,
			__pageGo,
			btnLoc = this.defaults.btnLoc,
			i;
		if(!btnLoc) {
			btnLoc = document.createElement('div');
			btnLoc.style.position = 'fixed';
			btnLoc.style.bottom = '0';
			btnLoc.style.right = '0';
			document.body.appendChild(btnLoc);
		}
		__pageGo = document.createElement('div');
		__pageGo.className = "__pageGo";
		__pageGo.innerHTML = '<label for="__gotoPageVal">' + MSG.jumptoPage + '</label><div class="input-append"><input class="input-minic" type="text" id="__gotoPageVal"/><input type="button" class="btn"  id="__goToBtn" value="Go"></div>';
		btnLoc.appendChild(__pageGo);
		
		a = document.createElement('a');
		a.className="btn __prev";
		a.innerHTML = "&lt";
		btns.appendChild(a);
		for(i = 1; i <= this.defaults.btnNum; i++) {
			a = document.createElement('a');
			a.className="btn __pageNum";
			a.innerHTML = i;
			btns.appendChild(a);
			if(i == 1 || i == this.defaults.btnNum - 1) {
				a = document.createElement('span');
				a.className = "info-hidden-flag";
				a.innerHTML = "...";
				btns.appendChild(a);
			}
		}
		a = document.createElement('a');
		a.className="btn __next";
		a.innerHTML = "&gt";
		btns.appendChild(a);
		btnLoc.appendChild(btns);
		this.initBtnEvent();
	}
	Page.prototype.initBtnEvent = function() {
			var idx,
				that = this,
				defaultSet = that.defaults;
			$(defaultSet.btnLoc).on('click', function(e){
			var target = e.target,
				$target = $(target);
				
			if($target.hasClass('__next')){
				if(defaultSet.pageIdx + 1 < defaultSet.pageLen) {
					defaultSet.pageIdx = defaultSet.pageIdx + 1;
					that.fillPageIdx(defaultSet.pageIdx, defaultSet.pContentArr);
				}
			}else if($target.hasClass('__prev')) {
				if(defaultSet.pageIdx - 1 >= 0) {
					defaultSet.pageIdx = defaultSet.pageIdx - 1;
					that.fillPageIdx(defaultSet.pageIdx, defaultSet.pContentArr);
				}
			}else if(target.id === '__goToBtn') {
				idx = document.getElementById('__gotoPageVal').value - 1;
				if(idx == defaultSet.pageIdx) {
					return;
				}
				if(0 <= idx && idx < defaultSet.pageLen){
					defaultSet.pageIdx = idx;
					that.fillPageIdx(idx, defaultSet.pContentArr);
				} else {
					$('#__gotoPageVal').val(MSG.pageRangeErr).select();
				}
			} else if($target.hasClass('__pageNum') && !$target.hasClass('active')) {
				idx = target.innerHTML - 1;
				if(idx < defaultSet.pageLen && idx >= 0){
					defaultSet.pageIdx = idx;
					that.fillPageIdx(idx, defaultSet.pContentArr);
				}
			}
		});

		//注释掉此段因为：IE（<=8)下不能选中输入框中的提示语
		/*$(defaultSet.btnLoc).on('selectstart', function() {
			return false;
		});*/
		$('#__gotoPageVal').on('keypress', function(e) {
			var charCode = e.charCode || e.keyCode;
				idx = +this.value  - 1;
			
			if(charCode == 13) {
				if(0 <= idx && idx < defaultSet.pageLen) {
					that.fillPageIdx(idx, defaultSet.pContentArr);
				} else {
					$(this).val(MSG.pageRangeErr).select();
				}
			} else {
				if(!/\d/.test(String.fromCharCode(charCode))) {
					e.__preventDefault ? e.__preventDefault() : e.returnValue = false;
					return false;
				}
			}
		});
	}
	Page.prototype.doPaging = function() {
		this.defaults.dataLen = parseInt(this.defaults.dataLen);
		this.defaults.pContentArr = this.calcPageArr(this.defaults.dataLen, this.defaults.pageRows);
		this.defaults.pageLen = this.defaults.pContentArr.length;
		//this.defaults.pageIdx = 0;
		this.fillPageIdx(this.defaults.pageIdx);
	}

	//填充页面 并 设置按钮显示
	Page.prototype.fillPageIdx = function(pageIdx) {
		var startIdx = this.defaults.pContentArr[pageIdx][0],
			endIdx = this.defaults.pContentArr[pageIdx][1] + 1;

		//*调用使用者自定义的填充函数，将显示数据范围传给它
		this.defaults.customFill(startIdx, endIdx);
		this.setBtnLoc(pageIdx, this.defaults.btnNum);

		$('#__gotoPageVal').val("");
	}

	//设置按钮的显示
	Page.prototype.setBtnLoc = function(idx, btnNum) {
		var i,
			pageLen = this.defaults.pageLen,
			mid = parseInt(btnNum/2) - 1,
			btnIdx = idx + 1,
			startBtnIdx = 1,
			numBtns = $('.__pageNum'),
			pageArea = $(this.defaults.btnLoc),
			infoHideFlag = $('.info-hidden-flag');
		if(pageLen <= 1) {
			pageArea.hide();
		} else {
			pageArea.show();
		}
		if(pageLen < btnNum) {
			infoHideFlag.hide();
			numBtns.each(function(i){
				if(i + 1 > pageLen) {
					this.style.display = 'none';
				} else {
					this.style.display = '';
					this.innerHTML = i+1;
				}
				$(this).removeClass('active');
			});
		} else {
			numBtns.each(function(i){
				this.style.display = '';
				$(this).removeClass('active');
			});
			if((btnIdx - 1 > mid) && (pageLen - btnIdx) > mid) {
				startBtnIdx = btnIdx -mid;
				numBtns.each(function(i){
					switch(i) {
						case 0:
							this.innerHTML = 1;
							break;
						case btnNum - 1:
							this.innerHTML = pageLen;
							break;
						default:
							this.innerHTML = startBtnIdx++;
					}
				});
			} else if(btnIdx - 1 <= mid) {
				numBtns.each(function(i){
					switch(i) {
						case btnNum - 1:
							this.innerHTML = pageLen;
							break;
						default:
							this.innerHTML = startBtnIdx++;
					}
				});
			} else if((pageLen - btnIdx) <= mid) {
				startBtnIdx = pageLen - btnNum + 2;
				numBtns.each(function(i){
					switch(i) {
						case 0:
							this.innerHTML = 1;
							break;
						default:
							this.innerHTML = startBtnIdx++;
					}
				});
			}
			if(+numBtns[0].innerHTML + 1 == numBtns[1].innerHTML) {
				infoHideFlag.eq(0).hide();
			} else {
				infoHideFlag.eq(0).show();
			}
			if(+numBtns[btnNum - 1].innerHTML == +numBtns[btnNum - 2].innerHTML + 1) {
				infoHideFlag.eq(1).hide();
			} else {
				infoHideFlag.eq(1).show();
			}
		}
		
		numBtns.each(function(i){
			if(this.innerHTML == btnIdx) {
				$(this).addClass('active');
			}
		});
	}

	/*计算分页内包含的起始和终止数据idx*/
	Page.prototype.calcPageArr = function (dataLen, pageRows){
		var pageCount,
			pContentArr = [];
		pageCount = parseInt(dataLen % pageRows === 0 ? dataLen / pageRows : dataLen / pageRows + 1);
		for(var i = 0; i < pageCount - 1; i++) {
			pContentArr.push([i * pageRows, (i + 1) * pageRows - 1]);
		}
		pContentArr.push([i * pageRows, dataLen - 1]);
		return pContentArr;
	}

	$.extend({
		
		/*dataLen: 数据总长度，
		 *fillFunction: 处理数据生成显示页的函数（需接受显示数据的起始和终止）
		 *btnLoc: 放置按钮的页面元素
		 *customArguments: 其它配置对象，含 ['btnNum', 'pageRows', 'pageIdx'],分别表示带数字的按钮数量，
		 *每页显示的条目数量，当前显示第几页
		*/
		paging: function( dataLen, fillFunction, btnLoc, customArguments ) {
			if(isNaN(dataLen) || !isFinite(dataLen) || !$.isFunction(fillFunction)) {
				
				alert("数据长度错误或未指定填充函数");
				return;
			}
			var selfConfig = {dataLen: dataLen, customFill: fillFunction, btnLoc: (typeof btnLoc == 'object' && btnLoc.tagName ? btnLoc : '')};
			var receiveProperty = ['btnNum', 'pageRows', 'pageIdx'];
			while(receiveProperty[0]) {
				var prop = receiveProperty.pop();
				if(!isNaN(customArguments[prop]) && isFinite(customArguments[prop])) {
					selfConfig[prop] = customArguments[prop];
				}
			}
			var thisPage = new Page(selfConfig);
			thisPage.createPageBtn();
			thisPage.doPaging();
			return thisPage;
		}
	});
}());