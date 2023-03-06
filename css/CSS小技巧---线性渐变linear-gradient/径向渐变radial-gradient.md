@[TOC](文章目录)

---

## 前言

本文主要介绍`linear-gradient`的使用方法，既有普通的用法，也有高级用法，主要实现的功能有渐变、条纹、斜向条纹、网格、模拟虚线、progress 进度条动画。看完本篇文章，相信你一定会有所收获
本文主要参考书籍【CSS 揭秘】

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 普通渐变

-最常见的用法是从字面意思理解，实现一个渐变背景，如下图效果
`background: linear-gradient(to right, #30e8bf, #ff8235);`
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718174507675.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

## 条纹

调整色标位置，实现两个非渐变效果
`background: linear-gradient(to right, #30e8bf 50%, #ff8235 50%);`
参数解释，颜色后面跟一个百分比，表示当前颜色的过渡位置，如果前后两个颜色的过渡位置一样，则不会出现平滑渐变效果，而是突然变化
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718174545625.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

## 条纹重复

渐变背景除了铺满整个背景，还可以手动调整渐变尺寸, 通过设置`background-size: 100% 50px`，设置宽度方向 100%铺满，竖向 50px，此时单个背景色高度是 25px，默认情况下是重复平铺整个背景，效果如下，

```css
background: linear-gradient(to bottom, #30e8bf 50%, #ff8235 50%);
background-size: 100% 50px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718174417596.png)

这里还有个**缩写**小技巧，如果后一个色标位置小于前一个色标的位置，则后一个色标位置会被它前面色标位置最大值替代，如上线三个不同颜色的条纹可以缩写成这样

```css
background: linear-gradient(
  to bottom,
  #30e8bf 33.3%,
  /* 这里的0，是缩写，相当于33.3% */ #2a6b7e 0,
  #2a6b7e 66.6%,
  /* 这里的0，是缩写，相当于66.6% */ #ff8235 0
);
background-size: 100% 50px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021071817435632.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

## 虚线

搭配使用 transparent 可以实现虚线效果，在写法上有两种

```css
height: 1px;
/* repeating写法和下面带background-size效果是一样的 */
/* background-image: repeating-linear-gradient(
        to right,
        gray,
        gray 10px,
        transparent 0,
        transparent 20px
      ); */
background-image: linear-gradient(to right, gray, gray 10px, transparent 0);
background-size: 20px 100%;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719183107473.png)
_额外提一句：实现虚线还可以使用 svg，关键词：`stroke-dasharray`_

## 斜向条纹

linear-gradient 的第一参数可以设置方向，除了水平垂直外，还可以设置角度。现在尝试将其设置为 45deg

```css
background: linear-gradient(45deg, #30e8bf 50%, #ff8235 50%);
background-size: 50px 50px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718180244950.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

发现这些格子没有无缝衔接，这时候可以利用 css 的另一个函数`repeating-linear-gradient`，这个函数会无限重复色标，所以色标位置应该填写**具体数值**，而且不需要设置`background-size`，如下图

```css
background: repeating-linear-gradient(
  45deg,
  #30e8bf 0,
  #30e8bf 25px,
  #ff8235 0,
  #ff8235 50px
);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718182534452.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

## 三角形

在创建斜向条纹时，无意中发现了三角形，现在我们尝试将另一颜色设置为透明，就能完美的实现了一个三角形啦

```css
height: 30px;
width: 30px;
background-image: linear-gradient(45deg, gray 50%, transparent 0);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719201101534.png)

## 进度条动画 progress

斜向条纹搭配`ainimation`， 动态改变`background-position-x`可以实现进度条动画

```css
.div10 {
  height: 20px;
  background: repeating-linear-gradient(
    45deg,
    #30e8bf 25%,
    #ff8235 0,
    #ff8235 50%,
    #30e8bf 0,
    #30e8bf 75%,
    #ff8235 0
  );
  background-size: 30px 30px;
  animation: roll 1s linear infinite;
}
@keyframes roll {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: 30px;
  }
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719192537733.gif#pic_center)

## 网格

linear-gradient 可以通过逗号，叠写多层渐变，横向网格+竖向网格叠加可以实现网格效果

```css
background-color: teal;
background-image: linear-gradient(white 1px, transparent 0), linear-gradient(90deg, white
      1px, transparent 0);
background-size: 30px 30px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718202308678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

多个`linear-gradient`叠加，再组合多个`background-size`还可以实现下图中效果

```css
background-color: teal;
background-image: linear-gradient(white 2px, transparent 0), linear-gradient(
    90deg,
    white 2px,
    transparent 0
  ), linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0),
  linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 0);
background-size: 75px 75px, 75px 75px, 15px 15px, 15px 15px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210718203111698.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

通过颜色透明度的叠加，可以实现类似桌布的效果

```css
background-color: white;
background-image: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.5) 50%,
    transparent 0
  ), linear-gradient(rgba(255, 0, 0, 0.5) 50%, transparent 0);
background-size: 30px 30px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021071820133463.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

## 圆点阵列

通过径向渐变`radial-gradient`可实现圆点，重复平铺就能形成圆点阵列
首先回顾下`radial-gradient`参数

> background-image: radial-gradient(shape size at position, start-color, ..., last-color);

| 值                           | 描述                                             |
| ---------------------------- | ------------------------------------------------ |
| shape                        | 确定圆的类型， 可取椭圆 ellipse，圆形 circle     |
| size                         | 定义渐变的大小                                   |
| position                     | 定义渐变的位置，可取 center（默认）、top、bottom |
| start-color, ..., last-color | 用于指定渐变的起止颜色                           |

```css
background-color: #f2f2f2;
background-image: radial-gradient(gray 20%, transparent 0);
background-size: 30px 30px;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210719200150720.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2huY3UxOTkw,size_16,color_FFFFFF,t_70)

## 波点图案

两层径向渐变，通过设置`background-position`将第二层背景偏移量设置为第一层的一半，可以实现波点图案
![在这里插入图片描述](https://img-blog.csdnimg.cn/202107192001213.png)
