export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: "VueJSSocketIoChat",
		htmlAttrs: {
			lang: "en"
		},
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" },
			{ name: "format-detection", content: "telephone=no" }
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		"@/assets/scss/globalStyle.scss"
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		"@/plugins/serverOrigin.js",
		"@/plugins/errorManager.js",
		"@/plugins/customFetch.js"
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		"@nuxtjs/eslint-module",
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		['cookie-universal-nuxt', { alias: 'cookiz' }],
		"@/socketIoServer/socket.js"
	],

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	},

	serverMiddleware: {
		"/api": "~/api"
	},
	server: {
		port: 8080, // default: 3000
		host: "0.0.0.0" // default: localhost
	}
}
