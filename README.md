# Description  
This is a postcss plugin for supportting bem syntax in the process of writing css or pcss. 

# Usage  
## Install && use
If you want to use this tool,the first step is installing it through npm.
```
npm i @mozheng-neal/postcss-bem --save-dev
```  
After installing it,this plugin can be used in multiple ways, such as webpack, gulp and so on, you could acquire the detail information at [how to use postcss](https://github.com/postcss/postcss)
## Example
The supported css bem syntax contains mainly @component, @descendent @modifier @when. A usage example as follows:  
```css  
html
<div class="container">
  <div class="container-child">
  </div>
  <div class="container--des">
  </div>
  <div class="container_state">
  </div>
</div>  

css/pcss
@component container {
  color: red;
  @descendent child {
    color: yellow
  }
  @modifier des {
    color: gray;
  }
  @when state {
    color: green;
  }
}
```  

