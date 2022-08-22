<template>
	<view class="page">
		<!-- 轮播图 start -->
		<swiper :indicator-dots="true" :autoplay="true" class="carousel">
			<swiper-item v-for="v in swiperList" :key="v.id">
				<image :src="v.image" class="carousel" />
			</swiper-item>
		</swiper>
		<!-- 轮播图 end -->
		<view v-for="(tag,i) in tagList" :key="i">
			<Tag :img-src="tag.imgSrc" :hot-title="tag.hotTitle" />
			<!-- 热门超英 -->
			<scroll-view scroll-x="true" class="page-block hot_scroll" @scrolltolower="scrollRightEnd">
				<view class="single-poster" v-for="item in hotData" :key="item.id" v-if="i == 0">
					<view class="single-wrapper">
						<image :src="item.images.small" class="poster" />
						<view class="movie-name">
							{{item.title}}
						</view>
						<Star :score="item.rating.average" showNum />
					</view>
				</view>
			</scroll-view>
			<!-- 热门预告 -->
			<view class="page-block hot-movies" v-if="i == 1">
				<video :id="v.id" @play="videoplay(v.id)" :src="v.src" :poster="v.poster" v-for="v in hotTrailerList"
					:key="v.id" controls class="single-movie"></video>
			</view>
			<!-- 猜你喜欢 -->
			<view class=" page-block guess" v-if="i == 2 ">
				<view class="like_movie" v-for="(v,gindex) in guessData" :key="v.id">
					<image class="poster" :src="v.images.small"></image>
					<view class="guess_desc">
						<view class="moive_title">{{v.title}}</view>
						<Star :score="v.rating.average" />
						<view class="moive_info">
							{{v.mainland_pubdate}}
						</view>
						<view class="moive_info">
							<text v-for="(g,i) in v.genres" :key="i">{{g}}</text>
						</view>
						<view class="moive_info">
							时长：{{v.durations[0]}}
						</view>
						<view class="moive_info">
							点赞数：{{v.collect_count}}
						</view>
					</view>
					<view class="movie_oper" @click="praiseMe(gindex)">
						<image src="../../static/icons/praise.png" class="praise_ico" />
						<view class="praise_me">赞一下</view>
						<view :animation="animationDataArr[gindex]" class="praise_me animation">+1</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Tag from '../../components/index/tag.vue'
	import Star from '../../components/common/star.vue'
	export default {
		components: {
			Tag,
			Star
		},
		data() {
			return {
				swiperList: [{
						"id": 1,
						"movieID": "",
						// 使用https://images.weserv.nl/?url=方式解决forbidden问题
						"image": "https://images.weserv.nl/?url=img1.doubanio.com/view/photo/l/public/p2410755737.webp",
						"sort": 1,
						"isShow": 1
					},
					{
						"id": 2,
						"movieID": "",
						"image": "https://images.weserv.nl/?url=//img3.doubanio.com/view/photo/l/public/p2556561071.webp",
						"sort": 1,
						"isShow": 1
					},
					{
						"id": 3,
						"movieID": "",
						"image": "https://images.weserv.nl/?url=img1.doubanio.com/view/photo/l/public/p2559849368.webp",
						"sort": 1,
						"isShow": 1
					},
					{
						"id": 4,
						"movieID": "",
						"image": "https://images.weserv.nl/?url=img3.doubanio.com/view/photo/l/public/p2432517600.webp",
						"sort": 1,
						"isShow": 1
					}
				],
				tagList: [{
					hotTitle: '热门超英',
					imgSrc: '../../static/icons/hot.png'
				}, {
					hotTitle: '热门预告',
					imgSrc: '../../static/icons/interest.png'
				}, {
					hotTitle: '猜你喜欢',
					imgSrc: '../../static/icons/guess-u-like.png'
				}],
				hotData: [], //热门超英数据
				hotCount: 10, //每次请求数据量
				// 热门预告s
				hotTrailerList: [{
						id: '001',
						src: 'http://qo1xme9v6.hn-bkt.clouddn.com/JusticeLeague.mp4',
						poster: 'http://qo1xme9v6.hn-bkt.clouddn.com/JusticeLeague.jpg'
					},
					{
						id: '002',
						src: 'http://qo1xme9v6.hn-bkt.clouddn.com/The%20Falcon%20and%20the%20Winter%20Soldier.mp4',
						poster: 'http://qo1xme9v6.hn-bkt.clouddn.com/The%20Falcon%20and%20the%20Winter%20Soldier.jpg'
					},
					{
						id: '003',
						src: 'http://qo1xme9v6.hn-bkt.clouddn.com/trailer3.mp4',
						poster: 'http://qo1xme9v6.hn-bkt.clouddn.com/trailer3.jpg'
					},
					{
						id: '004',
						src: 'http://mdup.apdcdn.tc.qq.com/vcloud1022.tc.qq.com/1022_d35f9f934fa64fb7b1c2f225337cf55c.f0.mp4?vkey=EF84BEC7B073D830522ADCDC3936E4F97318D878FD5B75D24D2B83D465724F1E8FD7465E3D1053139E75BFCA0112DFB33FE3AA851730FAEA841047CDEEDBA726E6FEF84FC3AF0005F46ED2A5BCB107A5D3D8AFD06458E4CC&sha=0',
						poster: 'http://qo1xme9v6.hn-bkt.clouddn.com/nz.png'
					},
					// {
					// 	id:'005',
					// 	src:'http://mdup.apdcdn.tc.qq.com/vcloud1022.tc.qq.com/1022_17aca686afb74be18abd1564b5b76531.f0.mp4?vkey=7140DFB86F5FFA4578448010304D675C3D13CC0A2E4FE6A6C5D2208719444B60FE7A6794A4C9CD496B6BFF423D34CD6052F9D4C8B33271AB9E6CBE8AAC75791E0D1F311237909ED7379ADAF666BDA86EB7F0EBDDC339B6AF&sha=0',
					// 	poster:'http://qo1xme9v6.hn-bkt.clouddn.com/nz.png'
					// }
				],
				// 猜你喜欢
				guessData: [],
				guessCount: 5, //每次请求数据量
				animationData: {},
				animationDataArr: [],
				videoCtx: null
			}
		},
		onUnload() {
			//页面卸载的时候，清楚动画的数据
			this.animationData = {}
		},
		onPullDownRefresh() {
			if (this.guessCount == 10) {
				this.guessCount = 5
				this.getGuessData()
			} else {
				this.guessCount += 5
				this.getGuessData()
			}
			this.$show()
			uni.stopPullDownRefresh()
		},
		onLoad() {
			// 模拟数据加载中
			uni.showLoading({
				mask: true,
				title: '加载中……'
			})
			setTimeout(() => {
				uni.hideLoading()
			}, 800)
			//在页面创建的时候，创建一个临时的动画对象
			this.animation = uni.createAnimation()
		},
		created() {
			this.getHotData()
			this.getGuessData()
		},
		onHide() {
			if(this.videoCtx){
				this.videoCtx.pause()
			}
		},
		methods: {
			getHotData() {
				let {
					subjects: data
				} = require('../../static/mock/top250.json')

				let newArr = []
				for (let i = 0; i < data.length; i++) {
					if (i + this.hotCount - 10 < this.hotCount) {
						let item = data[i + this.hotCount - 10]
						// 对图片做处理
						item.images.small = item.images.small.replace('https://', 'https://images.weserv.nl/?url=')
						newArr.push(item)
					}
				}
				this.hotData = [...this.hotData, ...newArr]
			},
			scrollRightEnd() {
				if (this.hotData.length == 50) {
					this.$show({
						icon: 'none',
						title: '没有更多数据了~'
					})
				} else {
					this.hotCount += 10
					this.getHotData()
				}
			},
			getGuessData() {
				let {
					subjects: data
				} = require('../../static/mock/weekly.json')
				console.log(data)
				let newArr = []
				for (let i = 0; i < data.length; i++) {
					if (i + this.guessCount - 5 < this.guessCount) {
						let item = data[i + this.guessCount - 5].subject
						// 对图片做处理
						item.images.small = item.images.small.replace('https://', 'https://images.weserv.nl/?url=')
						newArr.push(item)
					}
				}
				this.guessData = [...this.guessData, ...newArr]
			},
			//实现点赞动画效果
			praiseMe(i) {
				this.animation.translateY(-60).opacity(1).step({
					duration: 400
				})
				//导出动画数据到view组件，实现组件的动画效果
				this.animationData = this.animation
				this.animationDataArr[i] = this.animationData.export()
				//回到初始位置
				setTimeout(() => {
					this.animation.translateY(0).opacity(0).step({
						duration: 0
					})
					this.animationData = this.animation
					this.animationDataArr[i] = this.animationData.export()
				}, 500)
			},
			videoplay(id) {
				this.videoCtx = uni.createVideoContext(id)
				this.videoCtx.play()
				for (let v of this.hotTrailerList) {
					if (v.id != id) {
						uni.createVideoContext(v.id).pause()
					}
				}
			}
		}
	}
</script>

<style scoped>
	@import url("index.css");
</style>
