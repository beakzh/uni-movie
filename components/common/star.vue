<template>
	<view class="movie-score-wrapper">
		<image src="../../static/icons/star-yellow.png" class="star-icon" v-for="ys in yellowScore"  />
		<image src="../../static/icons/star-gray.png" class="star-icon" v-for="gs in grayScore" />
		<view class="movie-score" v-if="showNum">{{score}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			score: { //外部传入的分数
				type: Number,
				default: 0
			},
			showNum: Boolean //是否显示得分数
		},
		data() {
			return {
				yellowScore: 0,
				grayScore: 5
			}
		},
		created() {
			let tempScore = 0
			if (this.score) tempScore = this.score
			this.yellowScore = parseInt(tempScore / 2)
			this.grayScore = this.grayScore - this.yellowScore
		}
	}
</script>

<style lang="scss" scoped>
	.movie-score-wrapper {
		display: flex;
		flex-direction: row;

		.star-icon {
			width: 20upx;
			height: 20upx;
			margin-top: 6upx;
		}

		.movie-score {
			color: gray;
			font-size: 12px;
			margin-left: 8upx;
		}
	}
</style>
