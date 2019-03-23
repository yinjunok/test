module.exports = {
  // 静态资源部署目录
  // https://cli.vuejs.org/zh/config/#publicpath
  publicPath: '/',
  devServer: {
    proxy: {
      '/student_report_add': {
        target: 'http://huashida.kzmooc.com',
        changeOrigin: true
      },
    }
  }
}