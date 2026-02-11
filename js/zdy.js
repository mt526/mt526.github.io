var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();





//deepseek改的首次访问弹窗
try {
    // ========== 首次访问欢迎弹窗 ==========
    if (localStorage.getItem("popWelcomeWindow") !== "0") {
      try {
        let referrerText = '';
        if (!document.referrer || document.referrer.indexOf("mt526.github.io") !== -1) {
          referrerText = '欢迎访问本站！';
        } else {
          // 安全提取来源域名
          let match = document.referrer.match(/^https?:\/\/([^\/]+)/i);
          let sourceDomain = match ? match[1] : document.referrer;
          referrerText = `欢迎来自 ${sourceDomain} 的童鞋访问本站！`;
        }
        Snackbar.show({
          pos: "top-right",
          showAction: false,
          text: referrerText
        });
        localStorage.setItem("popWelcomeWindow", "0");
      } catch (e) {
        console.warn("欢迎弹窗显示失败", e);
      }
    }
  
    // ========== Cookie 提醒弹窗（仅一次）==========
    if (sessionStorage.getItem("popCookieWindow") !== "0") {
      setTimeout(function () {
        try {
          Snackbar.show({
            text: '本站使用Cookie和本地/会话存储保证浏览体验和网站统计',
            pos: 'bottom-right',
            actionText: '知道了',
            onActionClick: function(element) {
                Snackbar.close();   // 关闭所有弹窗，或当前活动弹窗
            }
          });
        } catch (e) {
          console.warn("Cookie提醒弹窗失败", e);
        }
      }, 3000);
    }
    sessionStorage.setItem("popCookieWindow", "0");
  
  } catch (e) {
    console.error("首次访问弹窗模块发生严重错误", e);
  }

//自带上文浏览器提示

function browserTC() {
    btf.snackbarShow("");
    Snackbar.show({
        text: '浏览器版本较低，网站样式可能错乱',
        actionText: '关闭',
        duration: '6000',
        pos: 'bottom-right'
    });
}
function browserVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //Edge浏览器
    var isFirefox = userAgent.indexOf("Firefox") > -1; //Firefox浏览器
    var isOpera = userAgent.indexOf("Opera")>-1 || userAgent.indexOf("OPR")>-1 ; //Opera浏览器
    var isChrome = userAgent.indexOf("Chrome")>-1 && userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Chrome浏览器
    var isSafari = userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Chrome")==-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Safari浏览器
    if(isEdge) {
        if(userAgent.split('Edge/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isFirefox) {
        if(userAgent.split('Firefox/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isOpera) {
        if(userAgent.split('OPR/')[1].split('.')[0]<80){
            browserTC()
        }
    } else if(isChrome) {
        if(userAgent.split('Chrome/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isSafari) {
        //不知道Safari哪个版本是该淘汰的老旧版本
    }
}
//2022-10-29修正了一个错误：过期时间应使用toGMTString()，而不是toUTCString()，否则实际过期时间在中国差了8小时
function setCookies(obj, limitTime) {
    let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toGMTString()
    for (let i in obj) {
        document.cookie = i + '=' + obj[i] + ';expires=' + data
    }
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
if(getCookie('browsertc')!=1){
    setCookies({
        browsertc: 1,
    }, 1);
    browserVersion();
} 

//fps

// if(window.localStorage.getItem("fpson")=="1"){
//如果要使博客设置上面的设置项能生效，就把上面一行取消注释
var rAF = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
var frame = 0;
var allFrameCount = 0;
var lastTime = Date.now();
var lastFameTime = Date.now();
var loop = function () {
    var now = Date.now();
    var fs = (now - lastFameTime);
    var fps = Math.round(1000 / fs);
 
    lastFameTime = now;
    // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
    allFrameCount++;
    frame++;
 
    if (now > 1000 + lastTime) {
        var fps = Math.round((frame * 1000) / (now - lastTime));
        if(fps<=6){
            var kd=`<span style="color:#bd0000">卡成ppt</span>`
        }
        else if(fps<=10){
            var kd=`<span style="color:red">电竞级帧率</span>`
        }
        else if(fps<=14){
            var kd=`<span style="color:yellow">难受</span>`
        }
        else if(fps<24){
            var kd=`<span style="color:orange">卡</span>`
        }
        else if(fps<=40){
            var kd=`<span style="color:green">正常</span>`
        }
        else if(fps<=90){
            var kd=`<span style="color:#425aef">流畅</span>`
        }
        else {
            var kd=`<span style="color:#4dffb2">丝滑</span>`
        }
        document.getElementById("fps").innerHTML=`FPS:${fps} ${kd}`;
        frame = 0;
        lastTime = now;
    };
 
    rAF(loop);
}

loop();
// }
// else{$("#fps").hide()}

//如果要使博客设置上面的设置项能生效，就把上面两行取消注释



//\\
//welcome

document.addEventListener('pjax:complete', todis);
document.addEventListener('DOMContentLoaded', todis);
function todis(){
$.ajax({
    type: 'get',
    url: 'https://apis.map.qq.com/ws/location/v1/ip',
    data: {
        key: 'T3EBZ-TJ7LI-YRBG2-5ZLUR-KD3OS-U6BJO',
        output: 'jsonp',
    },
    dataType: 'jsonp',
    success: function (res) {
        ipLoacation = res;
        function getDistance(e1, n1, e2, n2) {
            const R = 6371
            const { sin, cos, asin, PI, hypot } = Math
        
            let getPoint = (e, n) => {
                e *= PI / 180
                n *= PI / 180
                return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
            }
        
            let a = getPoint(e1, n1)
            let b = getPoint(e2, n2)
            let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
            let r = asin(c / 2) * 2 * R
            return Math.round(r);
        }
        
        function showWelcome() {
        
            let dist = getDistance(116, 36, ipLoacation.result.location.lng, ipLoacation.result.location.lat);
        
            let pos = ipLoacation.result.ad_info.nation;
            let posdesc;
            switch (ipLoacation.result.ad_info.nation) {
                case "日本":
                    posdesc = "よろしく，一起去看樱花吗";
                    break;
                case "美国":
                    posdesc = "Make America Great Again!";
                    break;
                case "英国":
                    posdesc = "想同你一起夜乘伦敦眼";
                    break;
                case "俄罗斯":
                    posdesc = "干了这瓶伏特加！";
                    break;
                case "法国":
                    posdesc = "C'est La Vie";
                    break;
                case "德国":
                    posdesc = "Die Zeit verging im Fluge.";
                    break;
                case "澳大利亚":
                    posdesc = "一起去大堡礁吧！";
                    break;
                case "加拿大":
                    posdesc = "拾起一片枫叶赠予你";
                    break;
                    case "中国":
                        pos = ipLoacation.result.ad_info.province + " " + ipLoacation.result.ad_info.city;
                        switch (ipLoacation.result.ad_info.province) {
                            case "北京市":
                                posdesc = "北——京——欢迎你~~~";
                                break;
                            case "天津市":
                                posdesc = "煎饼果子来一套，天津人说话自带相声味儿。";
                                break;
                            case "重庆市":
                                posdesc = "8D魔幻山城，火锅英雄故乡。";
                                break;
                            case "河北省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "石家庄市":
                                        posdesc = "国际庄欢迎你，正宗安徽板面管够。";
                                        break;
                                    case "保定市":
                                        posdesc = "驴肉火烧配保定铁球，舒服！";
                                        break;
                                    case "承德市":
                                        posdesc = "避暑山庄，皇帝来了都不想走。";
                                        break;
                                    case "秦皇岛市":
                                        posdesc = "长城入海处，北戴河吹吹风。";
                                        break;
                                    default:
                                        posdesc = "燕赵多慷慨，河北欢迎你。";
                                        break;
                                }
                                break;
                            case "山西省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "太原市":
                                        posdesc = "醋都太原，面食天堂。";
                                        break;
                                    case "大同市":
                                        posdesc = "塞上古都，云冈石窟，天下大同。";
                                        break;
                                    case "平遥县":  // 县级市需单独处理，实际返回为晋中市平遥县
                                        posdesc = "晋商故里，时光停在明清街。";
                                        break;
                                    default:
                                        posdesc = "宁舍一餐肉，不舍一口醋。";
                                        break;
                                }
                                break;
                            case "内蒙古自治区":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "呼和浩特市":
                                        posdesc = "天堂草原，魅力青城。";
                                        break;
                                    case "包头市":
                                        posdesc = "草原钢城，稀土之都。";
                                        break;
                                    case "呼伦贝尔市":
                                        posdesc = "天苍苍野茫茫，烤全羊是真香。";
                                        break;
                                    default:
                                        posdesc = "天苍苍，野茫茫，风吹草低见牛羊。";
                                        break;
                                }
                                break;
                            case "辽宁省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "沈阳市":
                                        posdesc = "一朝发祥地，两代帝王都。";
                                        break;
                                    case "大连市":
                                        posdesc = "浪漫之都，中国大连。";
                                        break;
                                    case "鞍山市":
                                        posdesc = "共和国钢都，玉佛伴千山。";
                                        break;
                                    default:
                                        posdesc = "鸡架配老雪，生活美滋滋。";
                                        break;
                                }
                                break;
                            case "吉林省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "长春市":
                                        posdesc = "北国春城，汽车电影双摇篮。";
                                        break;
                                    case "吉林市":
                                        posdesc = "雾凇奇观，乌拉火锅。";
                                        break;
                                    case "延边朝鲜族自治州":
                                        posdesc = "冷面辣白菜，欧巴欢迎你。";
                                        break;
                                    default:
                                        posdesc = "状元阁就是东北烧烤之王。";
                                        break;
                                }
                                break;
                            case "黑龙江省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "哈尔滨市":
                                        posdesc = "东方莫斯科，冰雪大世界。";
                                        break;
                                    case "齐齐哈尔市":
                                        posdesc = "鹤城烤肉，香飘千里。";
                                        break;
                                    case "牡丹江市":
                                        posdesc = "雪乡镜泊湖，北国好风光。";
                                        break;
                                    default:
                                        posdesc = "冰雪王国，锅包肉故乡。";
                                        break;
                                }
                                break;
                            case "上海市":
                                posdesc = "侬好，到屋里了。";
                                break;
                            case "江苏省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "南京市":
                                        posdesc = "六朝金粉地，鸭血粉丝汤。";
                                        break;
                                    case "苏州市":
                                        posdesc = "东方水城，园林甲天下。";
                                        break;
                                    case "无锡市":
                                        posdesc = "太湖佳绝处，酱排骨甜到心。";
                                        break;
                                    case "扬州市":
                                        posdesc = "烟花三月下扬州，早茶吃到饱。";
                                        break;
                                    case "常州市":
                                        posdesc = "中华恐龙园，淹城春秋梦。";
                                        break;
                                    default:
                                        posdesc = "散装十三太保，各显神通。";
                                        break;
                                }
                                break;
                            case "浙江省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "杭州市":
                                        posdesc = "人间天堂，爱情之都。";
                                        break;
                                    case "宁波市":
                                        posdesc = "书藏古今，港通天下。";
                                        break;
                                    case "温州市":
                                        posdesc = "温州皮革厂，老板跑路……开个玩笑，欢迎温商大佬！";
                                        break;
                                    case "绍兴市":
                                        posdesc = "乌篷船里听越剧，黄酒茴香豆。";
                                        break;
                                    case "嘉兴市":
                                        posdesc = "南湖红船，粽叶飘香。";
                                        break;
                                    default:
                                        posdesc = "浙里风景独好，互联网基因少不了。";
                                        break;
                                }
                                break;
                            case "安徽省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "合肥市":
                                        posdesc = "霸都欢迎你，科技创新高地。";
                                        break;
                                    case "黄山市":
                                        posdesc = "一生痴绝处，无梦到徽州。";
                                        break;
                                    case "芜湖市":
                                        posdesc = "芜湖起飞，真的起飞了。";
                                        break;
                                    case "蚌埠市":
                                        posdesc = "蚌埠住了，笑不活了。";
                                        break;
                                    default:
                                        posdesc = "美好安徽，迎客天下。";
                                        break;
                                }
                                break;
                            case "福建省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "福州市":
                                        posdesc = "八闽古都，有福之州。";
                                        break;
                                    case "厦门市":
                                        posdesc = "海上花园，温馨厦门。";
                                        break;
                                    case "泉州市":
                                        posdesc = "半城烟火半城仙，宋元东方第一大港。";
                                        break;
                                    case "武夷山市":
                                        posdesc = "大红袍故乡，九曲溪漂流。";
                                        break;
                                    default:
                                        posdesc = "山海画廊，爱拼才会赢。";
                                        break;
                                }
                                break;
                            case "江西省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "南昌市":
                                        posdesc = "英雄城，瓦罐汤拌粉。";
                                        break;
                                    case "九江市":
                                        posdesc = "庐山天下悠，浔阳江头夜送客。";
                                        break;
                                    case "景德镇市":
                                        posdesc = "千年瓷都，一窑烧出中国色。";
                                        break;
                                    case "赣州市":
                                        posdesc = "江南宋城，客家摇篮。";
                                        break;
                                    default:
                                        posdesc = "落霞与孤鹜齐飞，秋水共长天一色。";
                                        break;
                                }
                                break;
                            case "山东省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "济南市":
                                        posdesc = "泉城济南，大明湖畔夏雨荷。";
                                        break;
                                    case "青岛市":
                                        posdesc = "红瓦绿树，碧海蓝天，啤酒管够。";
                                        break;
                                    case "烟台市":
                                        posdesc = "仙境海岸，蓬莱八仙过海。";
                                        break;
                                    case "威海市":
                                        posdesc = "最干净的海滨城市，天尽头在成山头。";
                                        break;
                                    case "泰安市":
                                        posdesc = "会当凌绝顶，一览众山小。";
                                        break;
                                    default:
                                        posdesc = "煎饼卷大葱，好客山东欢迎侬。";
                                        break;
                                }
                                break;
                            case "河南省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "郑州市":
                                        posdesc = "火车拉来的城市，河南烩面真中！";
                                        break;
                                    case "洛阳市":
                                        posdesc = "神都洛阳，龙门石窟，牡丹甲天下。";
                                        break;
                                    case "开封市":
                                        posdesc = "东京汴梁，包青天上班的地方。";
                                        break;
                                    case "南阳市":
                                        posdesc = "四圣故里，卧龙岗上闲散人。";
                                        break;
                                    default:
                                        posdesc = "老家河南，伸手一摸就是春秋文化。";
                                        break;
                                }
                                break;
                            case "湖北省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "武汉市":
                                        posdesc = "江润三镇，城通九州，来碗热干面！";
                                        break;
                                    case "宜昌市":
                                        posdesc = "三峡门户，金色三峡银色大坝。";
                                        break;
                                    case "襄阳市":
                                        posdesc = "铁打的襄阳，郭靖黄蓉守过城。";
                                        break;
                                    case "恩施土家族苗族自治州":
                                        posdesc = "恩施大峡谷，土家女儿会。";
                                        break;
                                    default:
                                        posdesc = "来碗热干面，过早不重样。";
                                        break;
                                }
                                break;
                            case "湖南省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "长沙市":
                                        posdesc = "74751，长沙斯塔克，茶颜悦色安排上。";
                                        break;
                                    case "张家界市":
                                        posdesc = "奇峰三千，阿凡达悬浮山。";
                                        break;
                                    case "湘西土家族苗族自治州":
                                        posdesc = "凤凰古城，翠翠等你来。";
                                        break;
                                    case "衡阳市":
                                        posdesc = "寿岳衡山，祈福圣地。";
                                        break;
                                    default:
                                        posdesc = "恰得苦，霸得蛮，湘菜辣得欢。";
                                        break;
                                }
                                break;
                            case "广东省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "广州市":
                                        posdesc = "羊城花城食在广州，早茶夜宵不停嘴。";
                                        break;
                                    case "深圳市":
                                        posdesc = "来了就是深圳人，搞钱喝茶两不误。";
                                        break;
                                    case "珠海市":
                                        posdesc = "浪漫之城，百岛之市。";
                                        break;
                                    case "佛山市":
                                        posdesc = "陶艺之乡，叶问黄飞鸿老家。";
                                        break;
                                    case "潮州市":
                                        posdesc = "美食孤岛，工夫茶香。";
                                        break;
                                    default:
                                        posdesc = "食在广东，味在潮汕，福建人小心点。";
                                        break;
                                }
                                break;
                            case "广西壮族自治区":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "南宁市":
                                        posdesc = "绿城南宁，半城绿树半城楼。";
                                        break;
                                    case "桂林市":
                                        posdesc = "桂林山水甲天下，阳朔堪称甲桂林。";
                                        break;
                                    case "柳州市":
                                        posdesc = "螺蛳粉臭出圈，工业重镇也网红。";
                                        break;
                                    case "北海市":
                                        posdesc = "天下第一滩，银滩踩沙。";
                                        break;
                                    default:
                                        posdesc = "桂林山水甲天下，螺蛳粉臭出圈。";
                                        break;
                                }
                                break;
                            case "海南省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "海口市":
                                        posdesc = "椰风海韵，骑楼老街。";
                                        break;
                                    case "三亚市":
                                        posdesc = "天涯海角，东方夏威夷。";
                                        break;
                                    case "万宁市":
                                        posdesc = "冲浪胜地，日月湾等你来浪。";
                                        break;
                                    default:
                                        posdesc = "椰风海韵醉游人，天涯海角许余生。";
                                        break;
                                }
                                break;
                            case "四川省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "成都市":
                                        posdesc = "来了就不想走的城市，熊猫火锅搓麻将。";
                                        break;
                                    case "绵阳市":
                                        posdesc = "中国科技城，李白的故乡。";
                                        break;
                                    case "乐山市":
                                        posdesc = "乐山大佛，跷脚牛肉，甜皮鸭。";
                                        break;
                                    case "九寨沟县":
                                        posdesc = "童话世界，人间仙境。";
                                        break;
                                    default:
                                        posdesc = "熊猫故乡，火锅天堂，巴适得板。";
                                        break;
                                }
                                break;
                            case "贵州省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "贵阳市":
                                        posdesc = "爽爽贵阳，避暑天堂。";
                                        break;
                                    case "遵义市":
                                        posdesc = "转折之城，茅台故乡。";
                                        break;
                                    case "黔东南苗族侗族自治州":
                                        posdesc = "千户苗寨，侗族大歌。";
                                        break;
                                    case "安顺市":
                                        posdesc = "黄果树瀑布，亚洲第一瀑。";
                                        break;
                                    default:
                                        posdesc = "醉美黔贵，不止茅台。";
                                        break;
                                }
                                break;
                            case "云南省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "昆明市":
                                        posdesc = "昆明天天是春天，斗南花市论斤卖。";
                                        break;
                                    case "大理白族自治州":
                                        posdesc = "风花雪月，苍山洱海，一生不得不来。";
                                        break;
                                    case "丽江市":
                                        posdesc = "艳遇之都，玉龙雪山。";
                                        break;
                                    case "西双版纳傣族自治州":
                                        posdesc = "热带雨林，孔雀大象。";
                                        break;
                                    default:
                                        posdesc = "彩云之南，心的方向。";
                                        break;
                                }
                                break;
                            case "西藏自治区":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "拉萨市":
                                        posdesc = "日光之城，布达拉宫在等你。";
                                        break;
                                    case "日喀则市":
                                        posdesc = "珠穆朗玛，世界之巅。";
                                        break;
                                    default:
                                        posdesc = "躺在茫茫草原上，仰望最纯净的蓝天。";
                                        break;
                                }
                                break;
                            case "陕西省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "西安市":
                                        posdesc = "吹吹明城墙晚风，一睹大唐盛世颜。";
                                        break;
                                    case "宝鸡市":
                                        posdesc = "炎帝故里，青铜器之乡。";
                                        break;
                                    case "延安市":
                                        posdesc = "革命圣地，黄土高坡。";
                                        break;
                                    case "汉中市":
                                        posdesc = "西北小江南，油菜花海。";
                                        break;
                                    default:
                                        posdesc = "秦风唐韵，千年古都。";
                                        break;
                                }
                                break;
                            case "甘肃省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "兰州市":
                                        posdesc = "一碗牛肉面，一条黄河穿城过。";
                                        break;
                                    case "酒泉市":
                                        posdesc = "卫星发射中心，敦煌在隔壁。";
                                        break;
                                    case "敦煌市":
                                        posdesc = "飞天壁画，千年莫高窟。";
                                        break;
                                    default:
                                        posdesc = "羌笛何须怨杨柳，春风已度玉门关。";
                                        break;
                                }
                                break;
                            case "青海省":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "西宁市":
                                        posdesc = "夏都西宁，手抓羊肉酸奶香。";
                                        break;
                                    case "海西蒙古族藏族自治州":
                                        posdesc = "茶卡盐湖，天空之境。";
                                        break;
                                    default:
                                        posdesc = "高原蓝宝石，大美青海湖。";
                                        break;
                                }
                                break;
                            case "宁夏回族自治区":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "银川市":
                                        posdesc = "塞上明珠，中国银川。";
                                        break;
                                    case "中卫市":
                                        posdesc = "沙漠星星酒店，大漠孤烟直。";
                                        break;
                                    default:
                                        posdesc = "大漠孤烟直，长河落日圆。";
                                        break;
                                }
                                break;
                            case "新疆维吾尔自治区":
                                switch (ipLoacation.result.ad_info.city) {
                                    case "乌鲁木齐市":
                                        posdesc = "亚心之都，大盘鸡羊肉串。";
                                        break;
                                    case "喀什地区":
                                        posdesc = "不到喀什不算到新疆，异域风情浓。";
                                        break;
                                    case "伊犁哈萨克自治州":
                                        posdesc = "塞外江南，薰衣草花海。";
                                        break;
                                    default:
                                        posdesc = "驼铃古道丝绸路，大盘鸡里藏幸福。";
                                        break;
                                }
                                break;
                            case "台湾省":
                                posdesc = "我在这头，大陆在那头。";
                                break;
                            case "香港特别行政区":
                                posdesc = "东方之珠，购物天堂。";
                                break;
                            case "澳门特别行政区":
                                posdesc = "葡式蛋挞，中西合璧。";
                                break;
                            default:
                                posdesc = "社会主义好，来了都是客。";
                                break;
                        }
                        break;
                        
                default:
                    posdesc = "带我去你的国家逛逛吧。";
                    break;
            }
        
            //判断时间
            let timeChange;
            let date = new Date();
            if (date.getHours()>= 5 && date.getHours() < 11) timeChange = "<span>上午好</span>，一日之计在于晨";
            else if (date.getHours()>= 11 && date.getHours() < 13) timeChange = "<span>中午好</span>，该摸鱼吃午饭了";
            else if (date.getHours() >= 13 && date.getHours() < 15) timeChange = "<span>下午好</span>，懒懒地睡个午觉吧！";
            else if (date.getHours() >= 15 && date.getHours() < 16) timeChange = "<span>三点几啦</span>，饮茶先啦！";
            else if (date.getHours() >= 16 && date.getHours() < 19) timeChange = "<span>夕阳无限好！</span>";
            else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>晚上好</span>，夜生活嗨起来！";
            //else if (date.getHours() >= 0 && date.getHours() < 5) timeChange = "<span>晚上好</span>，夜生活嗨起来！";
            else timeChange = "夜深了，早点休息，少熬夜";

            //自己加的
            var Date3 = new Date();
            var year = Date3.getFullYear();
            var month = Date3.getMonth() + 1;
            var date2 = Date3.getDate();
            var dateArr = ["Sun","Mon",'Tues','Wednes','Thurs','Fri','Satur'];
            //var day= Date3.getDay();
            var hours = Date3.getHours();
            let day;
            if (Date3.getDay()==1) day="一";
            else if (Date3.getDay()==2) day="二";
            else if (Date3.getDay()==3) day="三";
            else if (Date3.getDay()==4) day="四";
            else if (Date3.getDay()==5) day="五";
            else if (Date3.getDay()==6) day="六";
            else if (Date3.getDay()==0) day="日";
            console.log(Date3.getDay())

            document.getElementsByClassName("announcement_content")[0].innerHTML =
                `现在是<span>${year}</span>年<span>${month}</span>月<span>${date2}</span>日 星期<span>${day}</span><br>欢迎来自<span color="#F42BF7">${pos}</span>的小伙伴，${timeChange}<br>
        你距离本作者约有<span>${dist}</span>公里。<br>${posdesc}
        <br>
        `;
        }
        showWelcome()
    }
    
})
    function switchPostChart () {
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
      try {
        let postsOptionNew = postsOption
        postsOptionNew.title.textStyle.color = color
        postsOptionNew.xAxis.nameTextStyle.color = color
        postsOptionNew.yAxis.nameTextStyle.color = color
        postsOptionNew.xAxis.axisLabel.color = color
        postsOptionNew.yAxis.axisLabel.color = color
        postsOptionNew.xAxis.axisLine.lineStyle.color = color
        postsOptionNew.yAxis.axisLine.lineStyle.color = color
        postsOptionNew.series[0].markLine.data[0].label.color = color
        postsChart.setOption(postsOptionNew)
      } catch (error) {
        console.log(error)
      }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
      try {
        let tagsOptionNew = tagsOption
        tagsOptionNew.title.textStyle.color = color
        tagsOptionNew.xAxis.nameTextStyle.color = color
        tagsOptionNew.yAxis.nameTextStyle.color = color
        tagsOptionNew.xAxis.axisLabel.color = color
        tagsOptionNew.yAxis.axisLabel.color = color
        tagsOptionNew.xAxis.axisLine.lineStyle.color = color
        tagsOptionNew.yAxis.axisLine.lineStyle.color = color
        tagsOptionNew.series[0].markLine.data[0].label.color = color
        tagsChart.setOption(tagsOptionNew)
      } catch (error) {
        console.log(error)
      }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
      try {
        let categoriesOptionNew = categoriesOption
        categoriesOptionNew.title.textStyle.color = color
        categoriesOptionNew.legend.textStyle.color = color
        if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
        categoriesChart.setOption(categoriesOptionNew)
      } catch (error) {
        console.log(error)
      }
    }
    }
    document.querySelector(".rightMenu-item:has(.fa-moon)").addEventListener("click", function () { setTimeout(switchPostChart, 100) })
    document.getElementById("con-mode").addEventListener("click", function () { setTimeout(switchPostChart, 100) })}
    //