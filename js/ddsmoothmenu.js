var ddsmoothmenu = {
	// Specify full URL to down and right arrow images (23 is padding-right
	// added to top level LIs with drop downs):
	arrowimages : {
		//down : [ 'downarrowclass', '/~arunbalajeev/images/down.gif', 23 ],
		down : [ 'downarrowclass', '/My Books/Arun_Resume/images/down.gif', 23 ],
		right : [ 'rightarrowclass', '/My Books/Arun_Resume/images/right.gif' ]
	},

	transition : {
		overtime : 100,
		outtime : 100
	}, // duration of slide in/ out animation, in milliseconds
	shadow : {
		enabled : true,
		offsetx : 5,
		offsety : 5
	},

	// /////Stop configuring beyond here///////////////////////////
	// detect WebKit browsers (Safari, Chrome etc)
	detectwebkit : navigator.userAgent.toLowerCase().indexOf("applewebkit") != -1,
	// function to fetch external page containing the panel DIVs
	getajaxmenu : function($, setting) {
		// reference empty div on page that will hold menu
		var $menucontainer = $('#' + setting.contentsource[0])
		$menucontainer.html("Loading Menu...")
		$
				.ajax( {
					// path to external menu file
					url : setting.contentsource[1],
					async : true,
					error : function(ajaxrequest) {
						$menucontainer
								.html('Error fetching content. Server Response: ' + ajaxrequest.responseText)
					},
					success : function(content) {
						$menucontainer.html(content)
						ddsmoothmenu.buildmenu($, setting)
					}
				})
	},
	buildshadow : function($, $subul) {
	},

	buildmenu : function($, setting) {
		var smoothmenu = ddsmoothmenu
		// reference main menu UL
		var $mainmenu = $("#" + setting.mainmenuid + ">ul")
		var $headers = $mainmenu.find("ul").parent()
		$headers.hover(function(e) {
			$(this).children('a:eq(0)').addClass('selected')
		}, function(e) {
			$(this).children('a:eq(0)').removeClass('selected')
		})
		$headers.each(function(i) {
			var $curobj = $(this).css( {
				zIndex : 100 - i
			}) // reference current LI header
				var $subul = $(this).find('ul:eq(0)').css( {
					display : 'block'
				})
				this._dimensions = {
					w : this.offsetWidth,
					h : this.offsetHeight,
					subulw : $subul.outerWidth(),
					subulh : $subul.outerHeight()
				}
				this.istopheader = $curobj.parents("ul").length == 1 ? true
						: false // is top level header?
				$subul.css( {
					top : this.istopheader ? this._dimensions.h + "px" : 0
				})
				$curobj
						.children("a:eq(0)")
						.css(this.istopheader ? {
							paddingRight : smoothmenu.arrowimages.down[2]
						} : {})
						.append( // add arrow images
								'<img src="'
										+ (this.istopheader ? smoothmenu.arrowimages.down[1]
												: smoothmenu.arrowimages.right[1])
										+ '" class="'
										+ (this.istopheader ? smoothmenu.arrowimages.down[0]
												: smoothmenu.arrowimages.right[0])
										+ '" style="border:0;" />')
				if (smoothmenu.shadow.enabled) {
					this._shadowoffset = {
						x : (this.istopheader ? $subul.offset().left
								+ smoothmenu.shadow.offsetx
								: this._dimensions.w),
						y : (this.istopheader ? $subul.offset().top
								+ smoothmenu.shadow.offsety : $curobj
								.position().top)
					} // store this shadow's offsets
					if (this.istopheader)
						$parentshadow = $(document.body)
					else {
						var $parentLi = $curobj.parents("li:eq(0)")
						$parentshadow = $parentLi.get(0).$shadow
					}
					this.$shadow = $(
							'<div class="ddshadow' + (this.istopheader ? ' toplevelshadow'
									: '') + '"></div>')
							.prependTo($parentshadow).css( {
								left : this._shadowoffset.x + 'px',
								top : this._shadowoffset.y + 'px'
							}) // insert shadow DIV and set it to parent node
					// for the next shadow div
				}
				$curobj
						.hover(function(e) {
							var $targetul = $(this).children("ul:eq(0)")
							this._offsets = {
								left : $(this).offset().left,
								top : $(this).offset().top
							}
							// calculate this sub menu's offsets from its parent
								var menuleft = this.istopheader ? 0
										: this._dimensions.w
								menuleft = (this._offsets.left + menuleft
										+ this._dimensions.subulw > $(window)
										.width()) ? (this.istopheader ? -this._dimensions.subulw
										+ this._dimensions.w
										: -this._dimensions.w)
										: menuleft
								// if 1 or less queued animations
								if ($targetul.queue().length <= 1) {
									$targetul.css( {
										left : menuleft + "px",
										width : this._dimensions.subulw + 'px'
									}).animate( {
										height : 'show',
										opacity : 'show'
									}, ddsmoothmenu.transition.overtime)
									if (smoothmenu.shadow.enabled) {
										var shadowleft = this.istopheader ? $targetul
												.offset().left
												+ ddsmoothmenu.shadow.offsetx
												: menuleft
										var shadowtop = this.istopheader ? $targetul
												.offset().top
												+ smoothmenu.shadow.offsety
												: this._shadowoffset.y
										// in WebKit browsers, restore shadow's
										// opacity to full
										if (!this.istopheader
												&& ddsmoothmenu.detectwebkit) {
											this.$shadow.css( {
												opacity : 1
											})
										}
										this.$shadow
												.css(
														{
															overflow : '',
															width : this._dimensions.subulw + 'px',
															left : shadowleft + 'px',
															top : shadowtop + 'px'
														})
												.animate(
														{
															height : this._dimensions.subulh + 'px'
														},
														ddsmoothmenu.transition.overtime)
									}
								}
							}, function(e) {
								var $targetul = $(this).children("ul:eq(0)")
								$targetul.animate( {
									height : 'hide',
									opacity : 'hide'
								}, ddsmoothmenu.transition.outtime)
								if (smoothmenu.shadow.enabled) {
									// in WebKit browsers, set first child
								// shadow's opacity to 0, as "overflow:hidden"
								// doesn't work in them
								if (ddsmoothmenu.detectwebkit) {
									this.$shadow.children('div:eq(0)').css( {
										opacity : 0
									})
								}
								this.$shadow.css( {
									overflow : 'hidden'
								}).animate( {
									height : 0
								}, ddsmoothmenu.transition.outtime)
							}
						}) // end hover
			}) // end $headers.each()
		$mainmenu.find("ul").css( {
			display : 'none',
			visibility : 'visible'
		})
	},

	init : function(setting) {
		if (typeof setting.customtheme == "object"
				&& setting.customtheme.length == 2) {
			var mainmenuid = '#' + setting.mainmenuid
			document.write('<style type="text/css">\n' + mainmenuid + ', '
					+ mainmenuid + ' ul li a {background:'
					+ setting.customtheme[0] + ';}\n' + mainmenuid
					+ ' ul li a:hover {background:' + setting.customtheme[1]
					+ ';}\n' + '</style>')
		}
		// override default menu colors (default/hover) with custom set?
		jQuery(document).ready(function($) {
			// if external ajax menu
				if (typeof setting.contentsource == "object") {
					ddsmoothmenu.getajaxmenu($, setting)
				} else { // else if markup menu
					ddsmoothmenu.buildmenu($, setting)
				}
			})
	}
}
// end ddsmoothmenu variable
// Initialize Menu instance(s):
ddsmoothmenu.init( {
	// menu DIV id customtheme: ["#1c5a80", "#18374a"], //override default menu
	// CSS background values? Uncomment: ["normal_background",
	// "hover_background"]
	mainmenuid : "smoothmenu1",
	// "markup" or ["container_id", "path_to_menu_file"]
	contentsource : "markup"
})
