const host = '../static/mock'
export let request = options => {
	options.url = host + options.url
	options.timeout = 60000
	if (!options.methods) options.methods = 'GET'
	if (!options.data) options.data = {}
	if (!options.header) options.header = {
		'Content-Type': 'application/json;charset=utf8'
	}
	return new Promise((reslove, reject) => {
		uni.request({
			url: options.url,
			data: options.data,
			success: (res) => {
				if (res.statusCode == 200) reslove(res)
				else reject('数据获取失败！')
			},
			fail: (err) => reject(err)
		})
	})
}

export let toast = (options = {
	title: 'OK',
	icon: 'success',
	position: 'center'
}) => {
	uni.showToast({
		title: options.title,
		icon: options.icon,
		position: options.position
	})
}

// 图片批量处理
export let toImg=(arg,reg='https://',rep='https://images.weserv.nl/?url=')=>{
	let newArg=null
	if(arg.constructor===Array){
		newArg=[]
		arg.forEach(item=>{
			newArg.push(item.replace(reg,rep))
		})
	}else{
		newArg=arg.replace(reg,rep)
	}
	return newArg
}
