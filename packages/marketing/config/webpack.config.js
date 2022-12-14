const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

const isProd = process.env.NODE_ENV === 'production'

const getStyleLoaders = (extraLoader) => {
	return [
		MiniCssExtractPlugin.loader,
		{
			loader: 'css-loader',
			options: {
				modules: {
					localIdentName: '[local]_[hash:base64:8]'
				}
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				postcssOptions: {
					plugins: ['postcss-preset-env']
				}
			}
		},
		extraLoader
	].filter(Boolean)
}

module.exports = {
	mode: isProd ? 'production' : 'development',
	entry: './src/main.ts',
	output: {
		path: isProd ? resolve(__dirname, '../dist') : undefined,
		filename: '[name].[contenthash:5].js',
		clean: true
	},
	devtool: isProd ? 'eval' : 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/i,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-react',
									{
										runtime: 'automatic'
									}
								],
								'@babel/preset-env',
								'@babel/preset-typescript'
							],
							plugins: [
								'@babel/plugin-transform-runtime',
								'@babel/plugin-proposal-class-properties',
								'@babel/plugin-proposal-object-rest-spread'
							]
						}
					}
				],
				include: [resolve(__dirname, '../src')]
			},
			{
				test: /\.module\.styl$/i,
				use: getStyleLoaders('stylus-loader'),
				include: [resolve(__dirname, '../src')]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve(__dirname, '../public/index.html')
		}),
		new MiniCssExtractPlugin({
			filename: 'static/css/[name].[contenthash:5].css',
			chunkFilename: 'static/css/[name].[contenthash:5].chunk.css'
		}),
		new ModuleFederationPlugin({
			name: 'marketing',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': resolve('./src/bootstrap')
			},
			// shared: ['react', 'react-dom', 'react-router-dom', 'redux']
			shared: {
				'react': '^18.2.0',
				'react-dom': '^18.2.0',
				'react-router-dom': '^6.4.3',
				'redux': '^4.2.0'
			}
		})
	],
	devServer: {
		host: 'localhost',
		open: true,
		port: 10086,
		hot: true,
		historyApiFallback: {
			index: 'index.html'
		}
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', '.module.styl']
	},
	stats: 'errors-only'
}
