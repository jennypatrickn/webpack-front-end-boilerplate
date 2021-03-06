import {
  PATH
} from './constants';
import path from 'path';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ReloadHtmlPlugin from 'reload-html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import api from '../src/server/api';
import { svgoConfigOptions } from './common';


export const server = ({
  host,
  port
}) => ({

  devServer: {
    watchOptions: {
      ignored: /node_modules/,
    },
    host,
    port,
    open: true,
    stats: 'errors-only',
    watchContentBase: false,
    historyApiFallback: true,
    setup(app) {
      api(app);
    }
  }
});

export const initBrowserSync = () => ({
  plugins: [
    new BrowserSyncPlugin(
      {
        // browse to http://localhost:3000/ during development 
        host: 'localhost',
        port: 3000,
        // proxy  webpack dev Server endpoint through browsersync
        proxy: 'http://localhost:8080/'
      },
      {
        // handle reload when files change
        reload: true
      }
    )
  ]
});

export const reloadBrowser = () => ({
  plugins: [
    new ReloadHtmlPlugin()
  ]
});

export const loadStyles = () => ({
  module: {
    rules: [{
      test: /\.scss$/,
      include: PATH.src,
      use: [{
          loader: 'style-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer],
            sourceMap: true
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            data: "$env: development;"
          }
        }
      ],
    }],
  },
});

export const lintScriptsOptions = {
  emitWarning: true,
  failOnWarning: false,
  failOnError: false,
  cache: true,
  fix: true
};

export const loadScripts = () => ({
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        "babel-loader",
        { 
          loader: "eslint-loader",
          options: lintScriptsOptions
        }
      ],
    }],
  }
});

export const generateSvgIcons = () => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, `${PATH.src}/icons`),
        use: [
          'svg-sprite-loader',
          {
            loader: 'svgo-loader',
            options: svgoConfigOptions
          }
        ]
      }
    ]
  }
});