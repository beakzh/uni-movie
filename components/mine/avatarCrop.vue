<template>
	<view class="page page-fill">
		<view class="page-body uni-content-info corpperWrapper">
			<view class='cropper-content'>
				<view v-if="isShowImg" class="uni-corpper" :style="'width:'+cropperInitW+'px;height:'+cropperInitH+'px;background:#000'">
					<view class="uni-corpper-content" :style="'width:'+cropperW+'px;height:'+cropperH+'px;left:'+cropperL+'px;top:'+cropperT+'px'">
						<image :src="imageSrc" class="myImage" :style="'width:'+cropperW+'px;height:'+cropperH+'px'"></image>
						<view class="uni-corpper-crop-box" @touchstart.stop="contentStartMove" @touchmove.stop="contentMoveing" @touchend.stop="contentTouchEnd"
							:style="'left:'+cutL+'px;top:'+cutT+'px;right:'+cutR+'px;bottom:'+cutB+'px'">
							<view class="uni-cropper-view-box">
								<view class="uni-cropper-dashed-h"></view>
								<view class="uni-cropper-dashed-v"></view>
								<view class="uni-cropper-line-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-line-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-line-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-line-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-point point-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-point point-tr" data-drag="topTight"></view>
								<view class="uni-cropper-point point-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-point point-rb" data-drag="rightBottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-point point-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove" @touchend.stop="dragEnd"></view>
								<view class="uni-cropper-point point-bl" data-drag="bottomLeft"></view>
								<view class="uni-cropper-point point-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
								<view class="uni-cropper-point point-lt" data-drag="leftTop"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class='cropper-config'>
				<button type="primary reverse" @click="getImage" style='margin-top: 30upx;'> ???????????? </button>
				<button type="warn" @click="getImageInfo" style='margin-top: 30upx;'> ?????????????????? </button>
			</view> -->
			<view class="footer-opertor">
				<view class="opertor-words" @click="getImage">
					????????????
				</view>
				<view class="opertor-words" @click="getImageInfo">
					????????????
				</view>
			</view>
			<canvas canvas-id="myCanvas" :style="'position:absolute;border: 1px solid red; width:'+imageW+'px;height:'+imageH+'px;top:-9999px;left:-9999px;'"></canvas>
		</view>
		<view class="notice">
			<view class="notice_words">
				* ?????????????????????????????????????????????
			</view>
		</view>
		<view @click="$emit('forCanel')">
			<Canel />
		</view>
	</view>
</template>

<script>
	import Canel from '../common/canel.vue'
	let sysInfo = uni.getSystemInfoSync();
	let SCREEN_WIDTH = sysInfo.screenWidth
	let PAGE_X, // ????????????x??????
		PAGE_Y, // ?????????y????????? 
		PR = sysInfo.pixelRatio, // dpi
		T_PAGE_X, // ??????????????????x?????????
		T_PAGE_Y, // ??????????????????Y?????????
		CUT_L, // ????????????????????????left???
		CUT_T, // ????????????????????????top???
		CUT_R, // ????????????????????????
		CUT_B, // ????????????????????????
		CUT_W, // ??????????????????????????????
		CUT_H, //  ??????????????????????????????
		IMG_RATIO, // ????????????
		IMG_REAL_W, // ?????????????????????
		IMG_REAL_H, // ?????????????????????
		DRAFG_MOVE_RATIO = 1, //?????????????????????,
		INIT_DRAG_POSITION = 100, // ??????????????????????????????????????????????????????????????????????????????????????????
		DRAW_IMAGE_W = sysInfo.screenWidth // ???????????????????????????
	export default {
		/**
		 * ?????????????????????
		 */
		props:{
			avatar:{
				type:String,
				default:'../../static/icons/108x108.png'
			}
		},
		data() {
			return {
				imageSrc: this.avatar, //?????????????????????,
				isShowImg: false,
				// ??????????????????
				cropperInitW: SCREEN_WIDTH,
				cropperInitH: SCREEN_WIDTH,
				// ???????????????
				cropperW: SCREEN_WIDTH,
				cropperH: SCREEN_WIDTH,
				// ?????????left top???
				cropperL: 0,
				cropperT: 0,
				transL: 0,
				transT: 0,
				// ???????????????
				scaleP: 0,
				imageW: 0,
				imageH: 0,
				// ????????? ??????
				cutL: 0,
				cutT: 0,
				cutB: SCREEN_WIDTH,
				cutR: '100%',
				qualityWidth: DRAW_IMAGE_W,
				innerAspectRadio: DRAFG_MOVE_RATIO,
			}
		},
		/**
		 * ??????????????????--??????????????????
		 */
		onLoad: function (params) {
			var imageSrc = params.tempFilePath;
			this.imageSrc = imageSrc;
			
			var globalUser = this.globalUser('globalUser')
			this.globalUser = globalUser;
		},
		/**
		 * ??????????????????--??????????????????????????????
		 */
		mounted: function () {
			this.loadImage();
		},
		methods: {
			setData: function (obj) {
				let that = this;
				Object.keys(obj).forEach(function (key) {
					that.$set(that.$data, key, obj[key])
				});
			},
			getImage: function () {
				var _this = this
				uni.chooseImage({
					success: function (res) {
						_this.setData({
							imageSrc: res.tempFilePaths[0],
						})
						_this.loadImage();
					},
				})
			},
			loadImage: function () {
				var _this = this
				uni.getImageInfo({
					src: _this.imageSrc,
					success: function success(res) {
						IMG_RATIO = res.width / res.height
						if (IMG_RATIO >= 1) {
							IMG_REAL_W = SCREEN_WIDTH
							IMG_REAL_H = SCREEN_WIDTH / IMG_RATIO
						} else {
							IMG_REAL_W = SCREEN_WIDTH * IMG_RATIO
							IMG_REAL_H = SCREEN_WIDTH
						}
						let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
						INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
						// ??????????????????????????????????????????   ??????????????????????????????
						if (IMG_RATIO >= 1) {
							let cutT = Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2);
							let cutB = cutT;
							let cutL = Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2);
							let cutR = cutL;
							_this.setData({
								cropperW: SCREEN_WIDTH,
								cropperH: SCREEN_WIDTH / IMG_RATIO,
								// ?????????left right
								cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
								cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
								cutL: cutL,
								cutT: cutT,
								cutR: cutR,
								cutB: cutB,
								// ???????????????
								imageW: IMG_REAL_W,
								imageH: IMG_REAL_H,
								scaleP: IMG_REAL_W / SCREEN_WIDTH,
								qualityWidth: DRAW_IMAGE_W,
								innerAspectRadio: IMG_RATIO
							})
						} else {
							let cutL = Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2);
							let cutR = cutL;
							let cutT = Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2);
							let cutB = cutT;
							_this.setData({
								cropperW: SCREEN_WIDTH * IMG_RATIO,
								cropperH: SCREEN_WIDTH,
								// ?????????left right
								cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
								cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
								cutL: cutL,
								cutT: cutT,
								cutR: cutR,
								cutB: cutB,
								// ???????????????
								imageW: IMG_REAL_W,
								imageH: IMG_REAL_H,
								scaleP: IMG_REAL_W / SCREEN_WIDTH,
								qualityWidth: DRAW_IMAGE_W,
								innerAspectRadio: IMG_RATIO
							})
						}
						_this.setData({
							isShowImg: true
						})
					}
				})
			},
			// ?????????????????????touchStart??????
			contentStartMove(e) {
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			// ?????????????????????touchMove??????
			contentMoveing(e) {
				var _this = this
				var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// ??????
				if (dragLengthX > 0) {
					if (this.cutL - dragLengthX < 0) dragLengthX = this.cutL
				} else {
					if (this.cutR + dragLengthX < 0) dragLengthX = -this.cutR
				}
				if (dragLengthY > 0) {
					if (this.cutT - dragLengthY < 0) dragLengthY = this.cutT
				} else {
					if (this.cutB + dragLengthY < 0) dragLengthY = -this.cutB
				}
				this.setData({
					cutL: this.cutL - dragLengthX,
					cutT: this.cutT - dragLengthY,
					cutR: this.cutR + dragLengthX,
					cutB: this.cutB + dragLengthY
				})
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			contentTouchEnd() {
			},
			// ????????????
			getImageInfo() {
				var _this = this;
				// #ifndef MP-WEIXIN
				uni.showLoading({
					mask:true,
					title: '???????????????...',
				});
				// ?????????????????????
				const ctx = uni.createCanvasContext('myCanvas');
				ctx.drawImage(_this.imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
				ctx.draw(true, () => {
					// ???????????????????????????????????????   ??????????????? * ????????????????????????    ???????????????????????????????????????????????????  ????????????????????? canvasT = (_this.cutT / _this.cropperH) * (_this.imageH / pixelRatio)
					var canvasW = ((_this.cropperW - _this.cutL - _this.cutR) / _this.cropperW) * IMG_REAL_W;
					var canvasH = ((_this.cropperH - _this.cutT - _this.cutB) / _this.cropperH) * IMG_REAL_H;
					var canvasL = (_this.cutL / _this.cropperW) * IMG_REAL_W;
					var canvasT = (_this.cutT / _this.cropperH) * IMG_REAL_H;
					uni.canvasToTempFilePath({
						x: canvasL,
						y: canvasT,
						width: canvasW,
						height: canvasH,
						destWidth: canvasW,
						destHeight: canvasH,
						quality: 0.5,
						canvasId: 'myCanvas',
						success: function (res) {
							uni.hideLoading();
							// ???????????????????????????-base64??????
							var tempFacePath = res.tempFilePath;
						
							// ??????????????????????????????????????????
								uni.showLoading({
									mask: true,
									title:'???????????????'
								})
								
								uni.uploadFile({
									url: 'http://localhost:8080/',
									filePath: tempFacePath,
									name: 'avatar',
									complete:res=>{
										// ??????????????????????????????
										uni.getStorage({
											key:'userInfo',
											success:info=>{
												let {data:userData}=info
												
												userData.avatar=tempFacePath
												uni.setStorage({
													key:'userInfo',
													data:userData
												})
												uni.hideLoading()
												_this.$emit('forCanel')
											}
										})
									}
							});
						}
					});
				});
				// #endif
				// #ifdef MP-WEIXIN
				_this.$emit('forCanel')
				// #endif
			},
			// ??????????????????????????????touchStart??????
			dragStart(e) {
				T_PAGE_X = e.touches[0].pageX
				T_PAGE_Y = e.touches[0].pageY
				CUT_L = this.cutL
				CUT_R = this.cutR
				CUT_B = this.cutB
				CUT_T = this.cutT
			},
			// ??????????????????????????????touchMove??????
			dragMove(e) {
				var _this = this
				var dragType = e.target.dataset.drag
				switch (dragType) {
					case 'right':
						var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_R + dragLength < 0) dragLength = -CUT_R
						this.setData({
							cutR: CUT_R + dragLength
						})
						break;
					case 'left':
						var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_L - dragLength < 0) dragLength = CUT_L
						if ((CUT_L - dragLength) > (this.cropperW - this.cutR)) dragLength = CUT_L - (this.cropperW - this.cutR)
						this.setData({
							cutL: CUT_L - dragLength
						})
						break;
					case 'top':
						var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_T - dragLength < 0) dragLength = CUT_T
						if ((CUT_T - dragLength) > (this.cropperH - this.cutB)) dragLength = CUT_T - (this.cropperH - this.cutB)
						this.setData({
							cutT: CUT_T - dragLength
						})
						break;
					case 'bottom':
						var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_B + dragLength < 0) dragLength = -CUT_B
						this.setData({
							cutB: CUT_B + dragLength
						})
						break;
					case 'rightBottom':
						var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
						if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
						let cutB = CUT_B + dragLengthY;
						let cutR = CUT_R + dragLengthX;
						this.setData({
							cutB: cutB,
							cutR: cutR
						})
						break;
					default:
						break;
				}
			}
		},
		components:{Canel}
	}
</script>
<style scoped>

	.cropper-config {
		padding: 20upx 40upx;
	}

	.cropper-content {
		min-height: 750upx;
		width: 100%;
	}

	.uni-corpper {
		position: relative;
		overflow: hidden;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		box-sizing: border-box;
	}

	.uni-corpper-content {
		position: relative;
	}

	.uni-corpper-content image {
		display: block;
		width: 100%;
		min-width: 0 !important;
		max-width: none !important;
		height: 100%;
		min-height: 0 !important;
		max-height: none !important;
		image-orientation: 0deg !important;
		margin: 0 auto;
	}
	/* ?????????????????? */

	.uni-cropper-drag-box {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		cursor: move;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}
	/* ??????????????? */

	.uni-corpper-crop-box {
		position: absolute;
		background: rgba(255, 255, 255, 0.3);
		z-index: 2;
	}

	.uni-corpper-crop-box .uni-cropper-view-box {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		outline: 1upx solid #69f;
		outline-color: rgba(102, 153, 255, .75)
	}
	/* ???????????? */

	.uni-cropper-dashed-h {
		position: absolute;
		top: 33.33333333%;
		left: 0;
		width: 100%;
		height: 33.33333333%;
		border-top: 1upx dashed rgba(255, 255, 255, 0.5);
		border-bottom: 1upx dashed rgba(255, 255, 255, 0.5);
	}
	/* ???????????? */

	.uni-cropper-dashed-v {
		position: absolute;
		left: 33.33333333%;
		top: 0;
		width: 33.33333333%;
		height: 100%;
		border-left: 1upx dashed rgba(255, 255, 255, 0.5);
		border-right: 1upx dashed rgba(255, 255, 255, 0.5);
	}
	/* ??????????????????  ???????????????????????????*/

	.uni-cropper-line-t {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		top: 0;
		left: 0;
		height: 1upx;
		opacity: 0.1;
		cursor: n-resize;
	}

	.uni-cropper-line-t::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0upx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41upx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-r {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		right: 0upx;
		width: 1upx;
		opacity: 0.1;
		height: 100%;
		cursor: e-resize;
	}

	.uni-cropper-line-r::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41upx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-b {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		bottom: 0;
		left: 0;
		height: 1upx;
		opacity: 0.1;
		cursor: s-resize;
	}

	.uni-cropper-line-b::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0upx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41upx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-l {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		left: 0;
		width: 1upx;
		opacity: 0.1;
		height: 100%;
		cursor: w-resize;
	}

	.uni-cropper-line-l::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41upx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-point {
		width: 5upx;
		height: 5upx;
		background-color: #69f;
		opacity: .75;
		position: absolute;
		z-index: 3;
	}

	.point-t {
		top: -3upx;
		left: 50%;
		margin-left: -3upx;
		cursor: n-resize;
	}

	.point-tr {
		top: -3upx;
		left: 100%;
		margin-left: -3upx;
		cursor: n-resize;
	}

	.point-r {
		top: 50%;
		left: 100%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-rb {
		left: 100%;
		top: 100%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		cursor: n-resize;
		width: 36upx;
		height: 36upx;
		background-color: #69f;
		position: absolute;
		z-index: 1112;
		opacity: 1;
	}

	.point-b {
		left: 50%;
		top: 100%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-bl {
		left: 0%;
		top: 100%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-l {
		left: 0%;
		top: 50%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-lt {
		left: 0%;
		top: 0%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}
	/* ????????????????????? */

	.uni-cropper-viewer {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.uni-cropper-viewer image {
		position: absolute;
		z-index: 2;
	}
	
	/* ?????????????????????css */
	.corpperWrapper{
		display: flex;
		align-items: center;
		height: 85%;
	}
	
	/* ?????????????????? */
	.page-fill {
		width:100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: black;
	}
	
	/* ???????????? start */
	.footer-opertor {
		position: fixed;
		/*#ifdef MP*/
		bottom: 0;
		/*#endif*/
		/*#ifndef MP*/
		bottom: 100upx;
		/*#endif*/
		
		border-top: #515050 solid 1px;
		width: 100%;
		
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		
		padding: 30upx;
	}
	.opertor-words {
		color: #e8e5e5;
		font-size: 16px;
		width: 200upx;
	}
	.notice{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	.notice_words{
		color: gray;
		font-size: 13px;
		margin-top: 30upx;
		width: 600upx;
	}
	.canel{
		position: absolute;
		top: 30upx;
		right: 30upx;
		color: #808080;
		font-size: 20px;
	}
</style>