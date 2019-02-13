<template>
  <div class="page-not-found">
    <h1>404 Error Page :3</h1>
    <p class="zoom-area"><b>抱歉，暂未发现该页面</b></p>
    <p>请确认你访问的地址正确，或者可以点击-> <a href="javascript:;" @click="goBack" class="more-link">返回</a></p>
    <section class="error-container">
      <span>4</span>
      <span><span class="screen-reader-text">0</span></span>
      <span>4</span>
    </section>
    <canvas id="canvas404"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: {},
      width: 0,
      height: 0,
      ctx: {}
    }
  },
  mounted() {
    var canvas = document.getElementById('canvas404')
    var height = canvas.height = window.innerHeight;
    var width = canvas.width = window.innerWidth - 15;
    var ctx = canvas.getContext('2d');
    this.canvas = canvas
    this.height = height
    this.width = width
    this.ctx = ctx
    document.body.appendChild(canvas);

    function random(min,max)
    {
      return Math.random()*(max-min+1)+min;
    }

    function range_map(value,in_min, in_max, out_min, out_max) {
      return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    var word_arr = [];
    var txt_min_size = 5;
    var txt_max_size = 25;
    var keypress = false;
    var acclerate = 2;
    for (var i = 0; i < 25; i++) {
      word_arr.push({
        x : random(0,width),
        y : random(0,height),
        text : '404',
        size : random(txt_min_size,txt_max_size)
      });

      word_arr.push({
        x : random(0,width),
        y : random(0,height),
        text : 'page',
        size : random(txt_min_size,txt_max_size)
      });

      word_arr.push({
        x : random(0,width),
        y : random(0,height),
        text : 'not found',
        size : random(txt_min_size,txt_max_size)
      });

      word_arr.push({
        x : random(0,width),
        y : random(0,height),
        text : '你看不到我',
        size : random(txt_min_size,txt_max_size)
      });

      word_arr.push({
        x : random(0,width),
        y : random(0,height),
        text : '404',
        size : Math.floor(random(txt_min_size,txt_max_size))
      });
    }

    function render()
    {
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fillRect(0,0,width,height);

      ctx.fillStyle = "#f9f9f9";
      for (var i = 0; i < word_arr.length; i++) {
        ctx.font = word_arr[i].size+"px sans-serif";
        var w = ctx.measureText(word_arr[i].text);
        ctx.fillText(word_arr[i].text,word_arr[i].x,word_arr[i].y);

        if(keypress)
        {
          word_arr[i].x += range_map(word_arr[i].size,txt_min_size,txt_max_size,2,4) * acclerate;
        }
        else {
          word_arr[i].x += range_map(word_arr[i].size,txt_min_size,txt_max_size,2,3);
        }

        if(word_arr[i].x >= width)
        {
          word_arr[i].x = -w.width*2;
          word_arr[i].y = random(0,height);
          word_arr[i].size =  Math.floor(random(txt_min_size,txt_max_size));
        }
      }

      ctx.fill();

      requestAnimationFrame(render);
    }

    render();

    window.addEventListener('keydown',function(){
      keypress = true;
    },true);
    window.addEventListener('keyup',function(){
      keypress = false;
    },true);
  },
  beforeRouteLeave(to, from, next) {
    let danmu = document.getElementById('canvas404')
    if (danmu) {
      danmu.remove()
    }
    next()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
.page-not-found {
  position: absolute;
  z-index: 2;
  top: 120px;
  left: 0;
  right: 0;
  margin: auto;
}
canvas {
  display:block;
  position: absolute;
  z-index: 0;
}
.error-container {
  text-align: center;
  font-size: 180px;
  font-weight: 800;
  margin: 20px 15px;
}
.error-container > span {
  display: inline-block;
  line-height: 0.7;
  position: relative;
  color: #FFB485;
}
.error-container > span {
  display: inline-block;
  position: relative;
  vertical-align: middle;
}
.error-container > span:nth-of-type(1) {
  color: #D1F2A5;
  animation: colordancing 4s infinite;
}
.error-container > span:nth-of-type(3) {
  color: #F56991;
  animation: colordancing2 4s infinite;
}
.error-container > span:nth-of-type(2) {
  width: 120px;
  height: 120px;
  border-radius: 999px;
}
.error-container > span:nth-of-type(2):before,
.error-container > span:nth-of-type(2):after {
	border-radius: 0%;
	content:"";
	position: absolute;
	top: 0; left: 0;
	width: inherit; height: inherit;
  border-radius: 999px;
	box-shadow: inset 30px 0 0 rgba(209, 242, 165, 0.4),
				inset 0 30px 0 rgba(239, 250, 180, 0.4),
				inset -30px 0 0 rgba(255, 196, 140, 0.4),	
				inset 0 -30px 0 rgba(245, 105, 145, 0.4);
  animation: shadowsdancing 4s infinite;
}
.error-container > span:nth-of-type(2):before {
	-webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}

.screen-reader-text {
    position: absolute;
    top: -9999em;
    left: -9999em;
}
@keyframes shadowsdancing {
  0% {
    box-shadow: inset 30px 0 0 rgba(209, 242, 165, 0.4),
				inset 0 30px 0 rgba(239, 250, 180, 0.4),
				inset -30px 0 0 rgba(255, 196, 140, 0.4),	
				inset 0 -30px 0 rgba(245, 105, 145, 0.4);
  }
  25% {
    box-shadow: inset 30px 0 0 rgba(245, 105, 145, 0.4),
				inset 0 30px 0 rgba(209, 242, 165, 0.4),
				inset -30px 0 0 rgba(239, 250, 180, 0.4),	
				inset 0 -30px 0 rgba(255, 196, 140, 0.4);
  }
  50% {
     box-shadow: inset 30px 0 0 rgba(255, 196, 140, 0.4),
				inset 0 30px 0 rgba(245, 105, 145, 0.4),
				inset -30px 0 0 rgba(209, 242, 165, 0.4),	
				inset 0 -30px 0 rgba(239, 250, 180, 0.4);
  }
  75% {
   box-shadow: inset 30px 0 0 rgba(239, 250, 180, 0.4),
				inset 0 30px 0 rgba(255, 196, 140, 0.4),
				inset -30px 0 0 rgba(245, 105, 145, 0.4),	
				inset 0 -30px 0 rgba(209, 242, 165, 0.4);
  }
  100% {
    box-shadow: inset 30px 0 0 rgba(209, 242, 165, 0.4),
				inset 0 30px 0 rgba(239, 250, 180, 0.4),
				inset -30px 0 0 rgba(255, 196, 140, 0.4),	
				inset 0 -30px 0 rgba(245, 105, 145, 0.4);
  }
}
@keyframes colordancing {
  0% {
    color: #D1F2A5;
  }
  25% {
    color: #F56991;
  }
  50% {
    color: #FFC48C;
  }
  75% {
    color: #EFFAB4;
  }
  100% {
    color: #D1F2A5;
  }
}
@keyframes colordancing2 {
  0% {
    color: #FFC48C;
  }
  25% {
    color: #EFFAB4;
  }
  50% {
    color: #D1F2A5;
  }
  75% {
    color: #F56991;
  }
  100% {
    color: #FFC48C;
  }
}
.zoom-area { 
  max-width: 490px;
  margin: 30px auto;
  margin-bottom: 0;
  font-size: 19px;
  text-align: center;
}
.link-container {
  text-align: center;
}
a.more-link {
  text-transform: uppercase;
  padding: 10px 15px;
  border-radius: 0;
  color: #c9151e;
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  line-height: 1.5;
  text-decoration: none;
  margin-top: 50px;
  letter-spacing: 1px;
}
</style>
