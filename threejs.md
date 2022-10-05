three.js

## three四大基础组件

### 场景 scene

相当于画布

### 相机 camera

正投影相机：近处和远处一样大，类似cad图

```js
const camera = new THREE.OrthographicCamera(left, right, top, near, far)
```

透视相机：近大远小

```js
// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(45， window.innerWidth/window.innerHeight, 1, 500)
```



### 几何体 geometry

呈现在场景（画布）之上的各种几何形状，集合物体

### 渲染器 renderer

将几何体渲染到画布上

```js
const renderer = new THREE.WebGLRenderer();
document.body.appendClild(renderer.domElement);
```







## 点线面

### 点

在三维空间中的某一个点可以用一个坐标点来表示。一个坐标点由x,y,z三个分量构成。在three.js中，点可以在右手坐标系中表示

![image-20210410164149797](/Users/xiongweiliu/Library/Application Support/typora-user-images/image-20210410164149797.png)

```js
// 创建点方法一
const point1 = new THREE.Vector3(x,y,z)

// 创建点方法二
const point2 = new THREE.Vector3()
point2.set(x,y,z)
```

### 线

初中数学中有一个定理：两个不重合的点能够决定一条直线。在three.js中，也可以通过定义两个点，来画一条直线

```js
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
// 直线几何体
const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
// 材质
// 线条可以使用的材质：LineBasicMaterial、LineDashedMaterial
const material = new THREE.LineBasicMaterial({color: 0xff0000})
// 直线
const line = new THREE.Line(lineGeometry, material)
```

## 光源

多种光源同时存在于场景之中, 结果会是两种光源相互叠加

### 环境光 AmbientLight

环境光会均匀的照亮场景中的所有物体。它没有方向。

不能投射阴影

```js
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
```



### 平行光 DirectionaLight

平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。

可以投射阴影

没有旋转效果

```js
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );
```

### 点光源

从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。

可以投射阴影

```js
// intensity 光照强度
// distance 光源到光照强度为0点位置，为0表示光永远不消失。缺省值0
// decay 	衰减值
var light = new THREE.PointLight( color, intensity, distance, decay );
light.position.set( 50, 50, 50 );
scene.add( light );
```

### 聚光灯

聚光灯是从一个方向上的一个点发出，沿着一个圆锥体，它离光越远，它的尺寸就越大。

可以投射阴影

### 材质

#### MeshLambertMaterial

材质会收到光源影响, 类似木材、石材的反光效果。

赋予材质的颜色，必须是有光源才能显示

```js
// 如下创建一个边长为3的立方体，赋予其材质颜色为蓝色，在没有光源的情况下，会显示黑色
var meshLambertMaterial = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
})
var cubeGeo = new THREE.BoxGeometry(3,3,3)
var cube = new THREE.mesh(cubeGeo, meshLambertMaterial)
```



### 纹理

可以简单理解成图片，贴图

构造函数`Texture( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding )`

