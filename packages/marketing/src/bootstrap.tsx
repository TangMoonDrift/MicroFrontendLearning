import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import './styles/global.module.styl'

const mount = (el: Element | DocumentFragment) => {
	if (el) {
		const root = createRoot(el)
		root.render(<App/>)
	}
}

if (process.env.NODE_ENV === 'development') {
	const root = document.getElementById('app')
	if (root) {
		mount(root)
	}
}

export {
	mount
}

