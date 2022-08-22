<template>
	<view class="register_login">
		<form @submit="formSubmit" class="form">
			<view class="face_wrapper">
				<image src="../../static/icons/default-face.png" mode="" class="face"></image>
			</view>
			<view class="info_wrapper">
				<text class="words_lbl">账号</text>
				<input type="text" name="username" class="input" placeholder="请输入用户名" placeholder-class="graywords" />
			</view>
			<view class="info_wrapper password_wrapper">
				<text class="words_lbl">密码</text>
				<input type="password" name="password" class="input" placeholder="请输入密码"
					placeholder-class="graywords" />
			</view>
			<button type="primary" form-type="submit" class="send_btn">登录/注册</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			formSubmit(e) {
				const username = e.detail.value.username.trim()
				const password = e.detail.value.password.trim()
				if (!username) {
					uni.showToast({
						icon: 'none',
						title: '请输入用户名'
					})

					return false
				}
				if (!password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false
				}
				if (username == 'admin' && password != 'admin') {
					uni.showToast({
					 title: '账号或密码错误',
						icon: 'none'
					})
					return false
				}
				// 模拟登录
				uni.request({
					url: '/',
					complete: res => {
						// 缓存用户信息
						uni.setStorage({
							key: 'userInfo',
							data: {
								avatar: '../../static/icons/108x108.png',
								username,
								ID: '123456789',
								sex: -1,
								birthday: '2020-05-20'
							}
						})
						// 页面切换
						this.$emit('forCanel')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.register_login {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9;
		padding: 0 40upx;
		border-top: 1px solid #dbdbda;
		background-color: #F8F8F8;

		.form {
			.face_wrapper {
				display: flex;
				flex-direction: row;
				justify-content: center;
				margin: 120upx auto;

				.face {
					width: 160upx;
					height: 160upx;
				}
			}

			.info_wrapper {
				display: flex;
				flex-direction: row;
				justify-content: center;
				border-bottom: 1px solid #dbdbda;
				padding-bottom: 20upx;

				.words_lbl {
					color: #808080;
				}

				.input {
					width: 500upx;
					margin-left: 40upx;
				}
			}

			.password_wrapper {
				margin-top: 40upx;
			}

			.send_btn {
				width: 90%;
				margin-top: 60upx;
			}
		}
	}
</style>
