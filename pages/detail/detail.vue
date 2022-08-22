<template>
	<view class="page movie_detail">
		<!-- 播放器 -->
		<view class="player">
			<video id="detail_video" src="http://qo1xme9v6.hn-bkt.clouddn.com/Nine.mp4"
				poster="http://qo1xme9v6.hn-bkt.clouddn.com/Nine.jpg" controls></video>
		</view>
		<!-- 电影信息  -->
		<view class="movie_info">
			<image :src="$img(detailData.images.small)" class="movie_cover" @click="toCover(true)"></image>
			<view class="moive_desc">
				<view class="movie_title">{{detailData.title}}</view>
				<view class="movie_base_info">
					<text>{{detailData.year}}</text>
					<text v-for="(v,i) in detailData.countries" :key="i">-{{v}}</text>
					<text v-for="(v,i) in detailData.languages">-{{v}}</text>
				</view>
				<view class="movie_base_info">
					<text v-for="(v,i) in detailData.genres">{{v}}/</text>
				</view>
				<view class="movie_base_info">{{detailData.durations[0]}}</view>
				<view class="movie_base_info">{{detailData.pubdates[0]}}</view>
				<view class="movie_score_wrapper">
					<view class="big_score">
						<view class="score_words"> 综合评分：</view>
						<view class="movie_score">{{detailData.rating.average}}</view>
					</view>
					<view class="score_stars">
						<Star :score="detailData.rating.average" />
						<view class="prise_counts">{{detailData.collect_count}}人点赞</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 分割线 -->
		<view class="line_wrapper">
			<view class="line"></view>
		</view>

		<!-- 剧情介绍 -->
		<view class="plots_block">
			<view class="plots_title">剧情介绍</view>
			<view class="plots_desc">{{detailData.summary}}</view>
		</view>

		<!-- 演职人员 -->
		<view class="scroll_block plots_block">
			<view class="plots_title">演职人员</view>
			<scroll-view scroll-x class="scroll_list">
				<view v-for="(director,index) in detailData.directors" class="actor_wrapper">
					<image :src="$img(director.avatars.small)" mode="aspectFill" @click="preview('directors',index)"
						class="actor_img"></image>
					<view class="actor_name">{{director.name}}</view>
					<view class="actor_role">{{director.name_en}}</view>
				</view>
				<view class="actor_wrapper" v-for="(cast, i) in detailData.casts">
					<image :src="$img(cast.avatars.small)" @click="preview('casts',index)" mode="aspectFill"
						class="actor_img"></image>
					<view class="actor_name">{{cast.name}}</view>
					<view class="actor_role">{{cast.name}}</view>
				</view>
			</scroll-view>


		</view>

		<!-- 剧照 -->
		<view class="scroll_block plots_block">
			<view class="plots_title">剧照</view>
			<scroll-view scroll-x class="scroll_list">
				<image :src="$img(img.thumb)" mode="aspectFill" v-for="(img,i) in detailData.photos" :key="img.id"
					class="plots_img" @click="preview('photos',i)" />
			</scroll-view>
		</view>

		<Cover v-if="showCover" :src="$img(detailData.images.small)" @fromCover="toCover(false)" />
	</view>
</template>

<script>
	import Star from '../../components/common/star.vue'
	import Cover from '../../components/detail/cover.vue'

	export default {
		components: {
			Star,
			Cover
		},
		data() {
			return {
				detailData: {},
				showCover: false,
				videoContext:null
			}
		},
		onLoad() {
			// 设置导航栏颜色
			uni.setNavigationBarColor({
				frontColor: "#FFFFFF",
				backgroundColor: "#000000"
			})
		},
		// 页面初次渲染完毕
		onReady() {
			// 获取视频上下文对象
			this.videoContext = uni.createVideoContext('detail_video')
		},
		onHide() {
			this.videoContext.pause()
		},
		onShow() {
			if(this.videoContext) this.videoContext.play()
		},
		onShareAppMessage(res) {
			return{
				title:this.detailData.title,
				path:'page/detail/detail',
				imageUrl:this.$img(this.detailData.images.small),
				sucess:_=>{
					uni.showToast({
						title:'分享成功'
					})
				},
				fail:_=>{
					uni.showToast({
						title:'分享失败',
						icon:'none'
					})
				}
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return{}
		},
		// 监听导航栏自定义按钮
		onNavigationBarButtonTap(res) {
			console.log(res)
			if(res.index ==0){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
					href: "/pages/detail/detail",
				    title: this.detailData.title,
				    summary: this.detailData.summary,
				    imageUrl: this.$img(this.detailData.images.small),
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}
		},
		created() {
			this.getDetailData()
		},
		methods: {
			getDetailData() {
				this.detailData = require('../../static/mock/detail.json')
				console.log(this.detailData)
				// 设置标题
				uni.setNavigationBarTitle({
					title: this.detailData.title
				})
			},
			preview(flag, i) {
				uni.previewImage({
					current: i,
					urls: flag == 'photos' ? this.detailData[flag].map(v => this.$img(v.thumb)) : this.detailData[
						flag].map(v => this.$img(v.avatars.small))
				})
			},
			toCover(flag) {
				this.showCover = flag
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("detail.css");
</style>
