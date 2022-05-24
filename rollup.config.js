import angular from 'rollup-plugin-angular';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default [{
  input: 'src/rollupmain.ts',
  output: {
    file: '../plugins/AppModule.js',
    format: 'umd',
    name: 'app-root',
    globals: [
      '@angular/core',
      '@angular/platform-browser',
      '@angular/common',
      '@angular/router',
      '@angular/platform-browser/animations',
      '@angular/common/http',
      '@angular/forms',
      '@ngx-translate/core',
      '@ngx-translate/http-loader',
      'primeng/table',
      'primeng/calendar',
      'primeng/dropdown',
      'primeng/selectbutton',
      'primeng/checkbox',
      'primeng/editor',
      'primeng/button',
      'primeng/fileupload',
      'primeng/panel',
      'ngx-toastr'
      
    ]
  },
  plugins: [
    angular(),
    resolve({
      jsnext: true,
      main: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    typescript({
      typescript: require('typescript')
    }),
    commonjs()]
  ,
  external: [
    '@angular/core',
    '@angular/platform-browser',
    '@angular/common',
    '@angular/router',
    '@angular/platform-browser/animations',
    '@angular/common/http',
    '@angular/forms',
    '@ngx-translate/core',
    '@ngx-translate/http-loader',
    'primeng/table',
    'primeng/calendar',
    'primeng/dropdown',
    'primeng/selectbutton',
    'primeng/checkbox',
    'primeng/editor',
    'primeng/button',
    'primeng/fileupload',
    'primeng/panel',
    'ngx-toastr'

  ]
}]