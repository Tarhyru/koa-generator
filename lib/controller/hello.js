const hello = {
	sayHello:(ctx)=>{
		ctx.body = 'hello'
		return ctx;
	}
}

module.exports = hello;