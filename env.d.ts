declare module '*.js'
declare module '*.styl'
declare module '*.module.styl' {
	const classes: {readonly [key: string]: string}
	export default classes
}
