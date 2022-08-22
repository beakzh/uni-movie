<template>
	<view class="page mine">
		<view class="header">
			<view v-if="userInfo.ID">
				<image :src="userInfo.avatar" mode="" class="face"></image>
			</view>
			<view v-else>
				<image src="../../static/icons/default-face.png" mode="" class="face"></image>
			</view>
			<view class="info_wrapper">
				<view v-if="userInfo.ID" class="info">
					<view class="nickname">
						{{userInfo.username}}
					</view>
					<view class="userid">
						ID：{{userInfo.ID}}
					</view>
				</view>
				<view v-else @click="toRegisterLogin" class="nickname">
					注册/登录
				</view>
			</view>
			<view v-if="userInfo.ID" class="set_wrapper">
				<image @click="userSetting" src="../../static/icons/settings.png" mode="" class="setting_icon"></image>
			</view>
		</view>
		<registerLogin v-if="showRegisterLogin" @forCanel="toCanel" />
		<userCenter v-if="showUserSetting" @forCanel="toCanel" />
	</view>
</template>

<script>
	import registerLogin from '../../components/mine/registerLogin'
	import userCenter from '../../components/mine/userCenter.vue'
	export default {
		components: {
			registerLogin,
			userCenter
		},
		data() {
			return {
				showRegisterLogin: false, //显示登录注册组件
				showUserSetting: false,
				userInfo: {}, //用户信息
			}
		},

		methods: {
			toRegisterLogin() {
				this.showRegisterLogin = true
			},
			// 用户设置中心
			userSetting(){
				this.showUserSetting=true
			},
			toCanel() {
				this.showRegisterLogin = false
				this.showUserSetting = false
				this.getUserInfo()
			},
			// 获取缓存中的信息
			getUserInfo() {
				uni.getStorage({
					key: 'userInfo',
					success: res => {
						this.userInfo = res.data
					},
					fail: () => {
						this.userInfo = {}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mine {
		width: 100%;
		height: 100%;

		.header {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			/* #ifdef MP */
			padding: 0 30upx 40upx 30upx;
			/* #endif */
			/* #ifndef MP */
			padding: 120upx 30upx 40upx 30upx;
			/* #endif */
			background-color: #ffd655;
			background: url('http://qo1xme9v6.hn-bkt.clouddn.com/mine_bg.png') repeat;

			.face {
				width: 120upx;
				height: 120upx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.info_wrapper {
				width: 70%;
				margin-left: 40upx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.info {
					max-width: 70%;
				}

				.nickname {
					color: #6a5018;
					font-size: 18px;
					font-weight: 700;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.userid {
					color: #a38e62;
					font-size: 14px;
					width: 100%;
					margin-top: 10upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.set_wrapper {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				width: 15%;

				.setting_icon {
					width: 40upx;
					height: 40upx;
				}
			}
		}
	}
</style>
