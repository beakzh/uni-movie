<template>
	<view class="search page">
		<view class="search_block">
			<view class="search_icon_wrapper">
				<image src="../../static/icons/search.png"  class="search_icon" />
			</view>
			<input type="text" value="" @input="toSearch" @confirm="toSearch" maxlength="10" class="search_text"
				placeholder="请输入搜索内容" />
		</view>
		<view class="movie_list page-block">
			<view class="movie_wrapper" v-for="v in searchData" :key="v.id">
				<image :src="v.images.small" class="poster" @click="toDetail" />
				<text class="movie_title">{{v.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: 12, //请求9条数据
				searchData: [], //数据
				originData: [], //原始数据，此处用于关键字搜索
				keywords: '', //搜索关键字
				page: 1, //当前页
				totalPage: 1, //总页数
			}
		},
		mounted() {
			this.getSearchData()
		},
		onReachBottom() {
			if (this.count >= this.originData.length) {
				this.$show({
					icon: 'none',
					title: '数据已经加载完了'
				})
			} else {
				this.count += 12

				this.getSearchData()
			}
		},
		methods: {
			getSearchData() {
				uni.showLoading({
					title: '加载中....'
				})
				if (this.originData.length == 0) {
					let {
						subjects: data
					} = require('../../static/mock/coming_soon.json')
					this.originData = data
					console.log(this.originData)

				} else this.searchData = []
				if (this.count > this.originData.length) this.count = this.originData.length
				let newArr = []
				for (let i = 0; i < this.originData.length; i++) {
					if (i + this.count - 12 < this.count) {
						let item = this.originData[i + this.count - 12]
						item.images.small = item.images.small.replace('https://', 'https://images.weserv.nl/?url=')
						newArr.push(item)
					}
				}
				this.searchData = [...this.searchData, ...newArr]
				console.log(this.searchData)
				uni.hideLoading()
			},
			toSearch(e) {
				let keywords = e.detail.value.trim()
				let newDataArr = []
				if (keywords) {
					newDataArr = this.originData.filter(v => v.title.includes(keywords))
				} else {
					this.getSearchData()
					this.$show({
						title: '请输入内容'
					})
				}
				if (newDataArr.length) { //数据存在
					this.searchData = newDataArr
				} else if (!newDataArr.length && keywords) { //数据不存在且有关键词
					this.searchData = []
					this.$show({
						icon: 'none',
						title: '暂时还没有~'
					})
				}
			},
			toDetail(){
				console.log(111)
				uni.navigateTo({
					url:"../detail/detail"
				})
			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
