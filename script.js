// 光速常量 (米/秒)
const SPEED_OF_LIGHT = 299792458;

// 天体数据库 - 包含数千个天体及其距离（以光秒为单位）
const CELESTIAL_BODIES = [
    // ==================== 地月系统 ====================
    { name: "地球同步轨道", distance: 0.12, unit: "光秒", description: "通信卫星的轨道高度", color: "#87CEEB", type: "satellite" },
    { name: "国际空间站", distance: 0.0013, unit: "光秒", description: "人类在太空的前哨站", color: "#C0C0C0", type: "satellite" },
    { name: "哈勃太空望远镜", distance: 0.0018, unit: "光秒", description: "观测宇宙的眼睛", color: "#4169E1", type: "satellite" },
    { name: "月球", distance: 1.28, unit: "光秒", description: "地球的天然卫星", color: "#C0C0C0", type: "moon" },
    { name: "月球远地点", distance: 1.37, unit: "光秒", description: "月球轨道最远点", color: "#C0C0C0", type: "moon" },
    { name: "拉格朗日L1点", distance: 5.0, unit: "光秒", description: "地日系统的引力平衡点", color: "#FFD700", type: "point" },
    { name: "拉格朗日L2点", distance: 5.2, unit: "光秒", description: "詹姆斯韦伯望远镜的位置", color: "#FFD700", type: "point" },

    // ==================== 内太阳系 ====================
    { name: "水星近日点", distance: 116, unit: "光秒", description: "水星轨道最近点", color: "#8C7853", type: "planet" },
    { name: "水星", distance: 193, unit: "光秒", description: "太阳系最内侧的行星", color: "#8C7853", type: "planet" },
    { name: "水星远日点", distance: 230, unit: "光秒", description: "水星轨道最远点", color: "#8C7853", type: "planet" },
    { name: "金星近日点", distance: 360, unit: "光秒", description: "金星轨道最近点", color: "#FFC649", type: "planet" },
    { name: "金星", distance: 418, unit: "光秒", description: "太阳系最热的行星", color: "#FFC649", type: "planet" },
    { name: "金星远日点", distance: 456, unit: "光秒", description: "金星轨道最远点", color: "#FFC649", type: "planet" },
    { name: "太阳", distance: 499, unit: "光秒", description: "太阳系的中心恒星", color: "#FFD700", type: "star" },
    { name: "火星近日点", distance: 620, unit: "光秒", description: "火星轨道最近点", color: "#CD5C5C", type: "planet" },
    { name: "火星", distance: 756, unit: "光秒", description: "红色星球", color: "#CD5C5C", type: "planet" },
    { name: "火星远日点", distance: 1020, unit: "光秒", description: "火星轨道最远点", color: "#CD5C5C", type: "planet" },

    // ==================== 小行星带 ====================
    { name: "谷神星", distance: 1300, unit: "光秒", description: "小行星带中最大的天体", color: "#A0522D", type: "asteroid" },
    { name: "灶神星", distance: 1250, unit: "光秒", description: "小行星带中的巨型小行星", color: "#8B4513", type: "asteroid" },
    { name: "智神星", distance: 1350, unit: "光秒", description: "第二大小行星", color: "#696969", type: "asteroid" },
    { name: "婚神星", distance: 1400, unit: "光秒", description: "第三大小行星", color: "#778899", type: "asteroid" },

    // ==================== 外太阳系 ====================
    { name: "木星近日点", distance: 1950, unit: "光秒", description: "木星轨道最近点", color: "#DAA520", type: "planet" },
    { name: "木星", distance: 2040, unit: "光秒", description: "太阳系最大的行星", color: "#DAA520", type: "planet" },
    { name: "木星远日点", distance: 2490, unit: "光秒", description: "木星轨道最远点", color: "#DAA520", type: "planet" },
    { name: "木卫一(伊奥)", distance: 2041, unit: "光秒", description: "木星的火山卫星", color: "#FFFF99", type: "moon" },
    { name: "木卫二(欧罗巴)", distance: 2043, unit: "光秒", description: "可能有海洋的冰卫星", color: "#E0E0E0", type: "moon" },
    { name: "木卫三(盖尼米德)", distance: 2047, unit: "光秒", description: "太阳系最大的卫星", color: "#A0A0A0", type: "moon" },
    { name: "木卫四(卡利斯托)", distance: 2056, unit: "光秒", description: "古老的冰质卫星", color: "#808080", type: "moon" },

    { name: "土星近日点", distance: 4500, unit: "光秒", description: "土星轨道最近点", color: "#F4A460", type: "planet" },
    { name: "土星", distance: 4680, unit: "光秒", description: "拥有美丽光环的行星", color: "#F4A460", type: "planet" },
    { name: "土星远日点", distance: 5040, unit: "光秒", description: "土星轨道最远点", color: "#F4A460", type: "planet" },
    { name: "土卫六(泰坦)", distance: 4690, unit: "光秒", description: "有大气层的卫星", color: "#DEB887", type: "moon" },
    { name: "土卫二(恩克拉多斯)", distance: 4682, unit: "光秒", description: "有地下海洋的冰卫星", color: "#F0F8FF", type: "moon" },

    { name: "天王星近日点", distance: 9150, unit: "光秒", description: "天王星轨道最近点", color: "#4FD0E7", type: "planet" },
    { name: "天王星", distance: 9720, unit: "光秒", description: "侧躺着自转的冰巨星", color: "#4FD0E7", type: "planet" },
    { name: "天王星远日点", distance: 10080, unit: "光秒", description: "天王星轨道最远点", color: "#4FD0E7", type: "planet" },

    { name: "海王星近日点", distance: 14280, unit: "光秒", description: "海王星轨道最近点", color: "#4169E1", type: "planet" },
    { name: "海王星", distance: 14400, unit: "光秒", description: "太阳系最外层的巨行星", color: "#4169E1", type: "planet" },
    { name: "海王星远日点", distance: 14520, unit: "光秒", description: "海王星轨道最远点", color: "#4169E1", type: "planet" },
    { name: "海卫一(崔顿)", distance: 14413, unit: "光秒", description: "逆行的大卫星", color: "#B0C4DE", type: "moon" },

    // ==================== 柯伊伯带和矮行星 ====================
    { name: "冥王星近日点", distance: 14700, unit: "光秒", description: "冥王星轨道最近点", color: "#8B7355", type: "planet" },
    { name: "冥王星", distance: 18000, unit: "光秒", description: "前太阳系第九大行星", color: "#8B7355", type: "planet" },
    { name: "冥王星远日点", distance: 24600, unit: "光秒", description: "冥王星轨道最远点", color: "#8B7355", type: "planet" },
    { name: "冥卫一(卡戎)", distance: 18001, unit: "光秒", description: "冥王星的大卫星", color: "#696969", type: "moon" },
    
    { name: "阋神星", distance: 43200, unit: "光秒", description: "比冥王星更大的矮行星", color: "#D2691E", type: "planet" },
    { name: "妊神星", distance: 17280, unit: "光秒", description: "椭球形的矮行星", color: "#BC8F8F", type: "planet" },
    { name: "鸟神星", distance: 21600, unit: "光秒", description: "柯伊伯带的矮行星", color: "#A0522D", type: "planet" },
    { name: "赛德娜", distance: 32400, unit: "光秒", description: "极远的矮行星", color: "#8B0000", type: "planet" },

    // ==================== 彗星 ====================
    { name: "哈雷彗星近日点", distance: 2664, unit: "光秒", description: "著名彗星的近日点", color: "#F0E68C", type: "comet" },
    { name: "哈雷彗星远日点", distance: 17640, unit: "光秒", description: "哈雷彗星的远日点", color: "#F0E68C", type: "comet" },
    { name: "海尔-波普彗星", distance: 36000, unit: "光秒", description: "20世纪末的大彗星", color: "#E6E6FA", type: "comet" },
    { name: "百武彗星", distance: 4320, unit: "光秒", description: "1996年的明亮彗星", color: "#F5F5DC", type: "comet" },

    // ==================== 奥尔特云 ====================
    { name: "奥尔特云内缘", distance: 63072000, unit: "光秒", description: "彗星的故乡内边界", color: "#2F4F4F", type: "cloud" },
    { name: "奥尔特云中部", distance: 315360000, unit: "光秒", description: "彗星储藏库的中心区域", color: "#2F4F4F", type: "cloud" },
    { name: "奥尔特云外缘", distance: 630720000, unit: "光秒", description: "太阳系的边界", color: "#2F4F4F", type: "cloud" },

    // ==================== 最近恒星系统 ====================
    { name: "比邻星", distance: 134000000, unit: "光秒", description: "距离太阳系最近的恒星", color: "#FF6347", type: "star" },
    { name: "半人马座α星A", distance: 137000000, unit: "光秒", description: "三合星系统的主星", color: "#FFD700", type: "star" },
    { name: "半人马座α星B", distance: 137000000, unit: "光秒", description: "三合星系统的伴星", color: "#FFA500", type: "star" },
    { name: "巴纳德星", distance: 189000000, unit: "光秒", description: "自行最大的恒星", color: "#FF4500", type: "star" },
    { name: "沃尔夫359", distance: 244800000, unit: "光秒", description: "红矮星", color: "#DC143C", type: "star" },
    { name: "拉兰德21185", distance: 272000000, unit: "光秒", description: "北天的红矮星", color: "#B22222", type: "star" },
    { name: "天狼星A", distance: 272000000, unit: "光秒", description: "夜空中最亮的恒星", color: "#87CEEB", type: "star" },
    { name: "天狼星B", distance: 272000000, unit: "光秒", description: "天狼星的白矮星伴星", color: "#F0F8FF", type: "star" },
    { name: "鲸鱼座UV星", distance: 280000000, unit: "光秒", description: "变星", color: "#FF6347", type: "star" },
    { name: "罗斯154", distance: 304000000, unit: "光秒", description: "耀星", color: "#CD5C5C", type: "star" },

    // ==================== 10-20光年恒星 ====================
    { name: "罗斯248", distance: 378000000, unit: "光秒", description: "红矮星", color: "#A0522D", type: "star" },
    { name: "波江座ε", distance: 350000000, unit: "光秒", description: "类太阳恒星", color: "#FFFF99", type: "star" },
    { name: "拉卡伊9352", distance: 332000000, unit: "光秒", description: "南天红矮星", color: "#8B4513", type: "star" },
    { name: "罗斯128", distance: 350000000, unit: "光秒", description: "安静的红矮星", color: "#CD853F", type: "star" },
    { name: "天鹅座61A", distance: 350000000, unit: "光秒", description: "双星系统主星", color: "#DDA0DD", type: "star" },
    { name: "天鹅座61B", distance: 350000000, unit: "光秒", description: "双星系统伴星", color: "#DA70D6", type: "star" },
    { name: "南门二", distance: 137000000, unit: "光秒", description: "半人马座α星系统", color: "#FFD700", type: "star" },
    { name: "印第安座ε", distance: 378000000, unit: "光秒", description: "类太阳恒星", color: "#F0E68C", type: "star" },
    { name: "天龙座DX", distance: 378000000, unit: "光秒", description: "红矮星", color: "#B22222", type: "star" },
    { name: "绘架座η", distance: 630000000, unit: "光秒", description: "年轻的恒星", color: "#87CEEB", type: "star" },

    // ==================== 20-50光年恒星 ====================
    { name: "织女星", distance: 817000000, unit: "光秒", description: "北半球夏季夜空的明亮恒星", color: "#E6E6FA", type: "star" },
    { name: "牛郎星", distance: 504000000, unit: "光秒", description: "天鹰座的主星", color: "#F0F8FF", type: "star" },
    { name: "南河三", distance: 378000000, unit: "光秒", description: "小犬座的主星", color: "#FFFACD", type: "star" },
    { name: "老人星", distance: 9450000000, unit: "光秒", description: "船底座的超巨星", color: "#F5F5DC", type: "star" },
    { name: "大角星", distance: 1134000000, unit: "光秒", description: "牧夫座的红巨星", color: "#FFA500", type: "star" },
    { name: "五车二", distance: 1350000000, unit: "光秒", description: "御夫座的主星", color: "#FFFF99", type: "star" },
    { name: "毕宿五", distance: 2079000000, unit: "光秒", description: "金牛座的红巨星", color: "#FF6347", type: "star" },
    { name: "轩辕十四", distance: 2457000000, unit: "光秒", description: "狮子座的主星", color: "#87CEEB", type: "star" },
    { name: "角宿一", distance: 7938000000, unit: "光秒", description: "室女座的蓝巨星", color: "#4169E1", type: "star" },
    { name: "十字架二", distance: 10206000000, unit: "光秒", description: "南十字座的蓝超巨星", color: "#0000FF", type: "star" },

    // ==================== 50-100光年恒星 ====================
    { name: "北极星", distance: 1390000000, unit: "光秒", description: "指示北方的导航星", color: "#F0F8FF", type: "star" },
    { name: "天津四", distance: 6300000000, unit: "光秒", description: "天鹅座的超巨星", color: "#87CEEB", type: "star" },
    { name: "心宿二", distance: 18900000000, unit: "光秒", description: "天蝎座的红超巨星", color: "#FF0000", type: "star" },
    { name: "弧矢七", distance: 15120000000, unit: "光秒", description: "大犬座的蓝超巨星", color: "#4169E1", type: "star" },
    { name: "娄宿三", distance: 4410000000, unit: "光秒", description: "白羊座的主星", color: "#F0E68C", type: "star" },
    { name: "昴宿六", distance: 12600000000, unit: "光秒", description: "昴星团的蓝巨星", color: "#87CEEB", type: "star" },
    { name: "昴宿七", distance: 12600000000, unit: "光秒", description: "昴星团的蓝巨星", color: "#B0C4DE", type: "star" },
    { name: "天关客星", distance: 20160000000, unit: "光秒", description: "金牛座的中子星", color: "#800080", type: "star" },
    { name: "河鼓二", distance: 504000000, unit: "光秒", description: "天鹰座α星", color: "#F0F8FF", type: "star" },
    { name: "天市右垣一", distance: 6930000000, unit: "光秒", description: "蛇夫座的巨星", color: "#DDA0DD", type: "star" },

    // ==================== 100-500光年恒星 ====================
    { name: "参宿四", distance: 21000000000, unit: "光秒", description: "猎户座的红超巨星", color: "#FF4500", type: "star" },
    { name: "参宿七", distance: 25200000000, unit: "光秒", description: "猎户座的蓝超巨星", color: "#4169E1", type: "star" },
    { name: "参宿一", distance: 7560000000, unit: "光秒", description: "猎户座的蓝巨星", color: "#87CEEB", type: "star" },
    { name: "参宿二", distance: 6930000000, unit: "光秒", description: "猎户座的蓝巨星", color: "#B0C4DE", type: "star" },
    { name: "参宿三", distance: 6300000000, unit: "光秒", description: "猎户座的蓝巨星", color: "#ADD8E6", type: "star" },
    { name: "井宿三", distance: 12600000000, unit: "光秒", description: "双子座的巨星", color: "#FFA500", type: "star" },
    { name: "井宿四", distance: 10800000000, unit: "光秒", description: "双子座的巨星", color: "#FFB347", type: "star" },
    { name: "柳宿增三", distance: 39900000000, unit: "光秒", description: "长蛇座的红巨星", color: "#FF6347", type: "star" },
    { name: "张宿一", distance: 50400000000, unit: "光秒", description: "长蛇座的巨星", color: "#DDA0DD", type: "star" },
    { name: "翼宿一", distance: 75600000000, unit: "光秒", description: "巨爵座的巨星", color: "#F0E68C", type: "star" },

    // ==================== 500-1000光年恒星 ====================
    { name: "天狼增四", distance: 126000000000, unit: "光秒", description: "船尾座的超巨星", color: "#87CEEB", type: "star" },
    { name: "弧矢增二十二", distance: 151200000000, unit: "光秒", description: "船尾座的蓝超巨星", color: "#4169E1", type: "star" },
    { name: "南河增一", distance: 189000000000, unit: "光秒", description: "双子座的超巨星", color: "#FFD700", type: "star" },
    { name: "鬼宿二", distance: 176400000000, unit: "光秒", description: "巨蟹座的巨星", color: "#FFA500", type: "star" },
    { name: "柳宿增十", distance: 214200000000, unit: "光秒", description: "长蛇座的超巨星", color: "#FF4500", type: "star" },
    { name: "翼宿五", distance: 252000000000, unit: "光秒", description: "巨爵座的超巨星", color: "#DC143C", type: "star" },
    { name: "轸宿一", distance: 289800000000, unit: "光秒", description: "乌鸦座的巨星", color: "#B22222", type: "star" },
    { name: "角宿增一", distance: 327600000000, unit: "光秒", description: "室女座的超巨星", color: "#8B0000", type: "star" },

    // ==================== 1000-5000光年恒星 ====================
    { name: "天津增七", distance: 630000000000, unit: "光秒", description: "天鹅座的极超巨星", color: "#FF0000", type: "star" },
    { name: "海山二", distance: 2394000000000, unit: "光秒", description: "船底座的高光度蓝变星", color: "#FF69B4", type: "star" },
    { name: "手枪星", distance: 756000000000, unit: "光秒", description: "人马座的高光度蓝变星", color: "#FF1493", type: "star" },
    { name: "参宿增二十九", distance: 1890000000000, unit: "光秒", description: "猎户座的超巨星", color: "#FF4500", type: "star" },
    { name: "天鹅座P", distance: 1512000000000, unit: "光秒", description: "红超巨星", color: "#8B0000", type: "star" },
    { name: "仙王座μ", distance: 2268000000000, unit: "光秒", description: "红超巨星", color: "#DC143C", type: "star" },
    { name: "天鹅座KY", distance: 1260000000000, unit: "光秒", description: "红超巨星", color: "#B22222", type: "star" },
    { name: "盾牌座UY", distance: 2835000000000, unit: "光秒", description: "已知最大的恒星之一", color: "#800000", type: "star" },

    // ==================== 星团和星云 ====================
    { name: "昴星团", distance: 12600000000, unit: "光秒", description: "金牛座的疏散星团", color: "#87CEEB", type: "cluster" },
    { name: "毕星团", distance: 4536000000, unit: "光秒", description: "金牛座的疏散星团", color: "#DDA0DD", type: "cluster" },
    { name: "蜂巢星团", distance: 18900000000, unit: "光秒", description: "巨蟹座的疏散星团", color: "#F0E68C", type: "cluster" },
    { name: "双星团", distance: 22680000000, unit: "光秒", description: "英仙座的双疏散星团", color: "#B0C4DE", type: "cluster" },
    { name: "猎户座大星云", distance: 4410000000, unit: "光秒", description: "恒星形成区", color: "#FF69B4", type: "nebula" },
    { name: "马头星云", distance: 4725000000, unit: "光秒", description: "猎户座的暗星云", color: "#2F4F4F", type: "nebula" },
    { name: "鹰星云", distance: 22680000000, unit: "光秒", description: "巨蛇座的恒星形成区", color: "#8B4513", type: "nebula" },
    { name: "猫眼星云", distance: 10206000000, unit: "光秒", description: "天龙座的行星状星云", color: "#00CED1", type: "nebula" },
    { name: "环状星云", distance: 7938000000, unit: "光秒", description: "天琴座的行星状星云", color: "#32CD32", type: "nebula" },
    { name: "蟹状星云", distance: 20160000000, unit: "光秒", description: "金牛座的超新星遗迹", color: "#FF6347", type: "nebula" },

    // ==================== 球状星团 ====================
    { name: "M13武仙座球状星团", distance: 756000000000, unit: "光秒", description: "北天最亮的球状星团", color: "#FFD700", type: "cluster" },
    { name: "M22人马座球状星团", distance: 315360000000, unit: "光秒", description: "人马座的球状星团", color: "#DDA0DD", type: "cluster" },
    { name: "M3猎犬座球状星团", distance: 1008000000000, unit: "光秒", description: "猎犬座的球状星团", color: "#F0E68C", type: "cluster" },
    { name: "M5巨蛇座球状星团", distance: 756000000000, unit: "光秒", description: "巨蛇座的球状星团", color: "#87CEEB", type: "cluster" },
    { name: "M15飞马座球状星团", distance: 1134000000000, unit: "光秒", description: "飞马座的球状星团", color: "#B0C4DE", type: "cluster" },
    { name: "半人马座ω", distance: 504000000000, unit: "光秒", description: "最亮的球状星团", color: "#FFB347", type: "cluster" },
    { name: "杜鹃座47", distance: 441000000000, unit: "光秒", description: "南天的球状星团", color: "#DEB887", type: "cluster" },

    // ==================== 银河系结构 ====================
    { name: "银河系旋臂", distance: 63072000000, unit: "光秒", description: "我们所在的猎户臂", color: "#483D8B", type: "structure" },
    { name: "英仙臂", distance: 126144000000, unit: "光秒", description: "银河系的主要旋臂", color: "#4B0082", type: "structure" },
    { name: "人马臂", distance: 189216000000, unit: "光秒", description: "银河系的主要旋臂", color: "#800080", type: "structure" },
    { name: "银河系厚盘", distance: 315360000000, unit: "光秒", description: "银河系的厚盘结构", color: "#663399", type: "structure" },
    { name: "银河系晕", distance: 1890000000000, unit: "光秒", description: "银河系的球状晕", color: "#4B0082", type: "structure" },
    { name: "银河系中心", distance: 850000000000, unit: "光秒", description: "我们星系的中心", color: "#800080", type: "galaxy" },
    { name: "人马座A*", distance: 850000000000, unit: "光秒", description: "银河系中心的超大质量黑洞", color: "#000000", type: "blackhole" },

    // ==================== 附近星系 ====================
    { name: "大麦哲伦云", distance: 5040000000000, unit: "光秒", description: "银河系的卫星星系", color: "#9370DB", type: "galaxy" },
    { name: "小麦哲伦云", distance: 6300000000000, unit: "光秒", description: "银河系的卫星星系", color: "#8A2BE2", type: "galaxy" },
    { name: "人马座矮椭球星系", distance: 2268000000000, unit: "光秒", description: "最近的矮星系", color: "#7B68EE", type: "galaxy" },
    { name: "大熊座矮星系", distance: 3150000000000, unit: "光秒", description: "本星系群的矮星系", color: "#6A5ACD", type: "galaxy" },
    { name: "天龙座矮星系", distance: 7560000000000, unit: "光秒", description: "本星系群的矮星系", color: "#9932CC", type: "galaxy" },
    { name: "船底座矮星系", distance: 9450000000000, unit: "光秒", description: "本星系群的矮星系", color: "#8B008B", type: "galaxy" },
    { name: "六分仪座矮星系", distance: 8820000000000, unit: "光秒", description: "本星系群的矮星系", color: "#9400D3", type: "galaxy" },
    { name: "狮子座I", distance: 25200000000000, unit: "光秒", description: "本星系群的矮椭球星系", color: "#4B0082", type: "galaxy" },
    { name: "狮子座II", distance: 22680000000000, unit: "光秒", description: "本星系群的矮椭球星系", color: "#483D8B", type: "galaxy" },

    // ==================== 本星系群 ====================
    { name: "仙女座星系", distance: 79000000000000, unit: "光秒", description: "距离银河系最近的大星系", color: "#9370DB", type: "galaxy" },
    { name: "仙女座星系M32", distance: 79000000000000, unit: "光秒", description: "仙女座星系的卫星星系", color: "#8A2BE2", type: "galaxy" },
    { name: "仙女座星系M110", distance: 79000000000000, unit: "光秒", description: "仙女座星系的卫星星系", color: "#7B68EE", type: "galaxy" },
    { name: "三角座星系", distance: 94500000000000, unit: "光秒", description: "本星系群第三大星系", color: "#6A5ACD", type: "galaxy" },
    { name: "IC10", distance: 70560000000000, unit: "光秒", description: "本星系群的不规则星系", color: "#9932CC", type: "galaxy" },
    { name: "NGC6822", distance: 50400000000000, unit: "光秒", description: "本星系群的不规则星系", color: "#8B008B", type: "galaxy" },
    { name: "沃尔夫-伦德马克-梅洛特星系", distance: 94500000000000, unit: "光秒", description: "本星系群边缘的矮星系", color: "#9400D3", type: "galaxy" },

    // ==================== 室女座星系团 ====================
    { name: "室女座A", distance: 1700000000000000, unit: "光秒", description: "室女座星系团的中心星系", color: "#4B0082", type: "galaxy" },
    { name: "M87", distance: 1700000000000000, unit: "光秒", description: "室女座星系团的巨椭圆星系", color: "#483D8B", type: "galaxy" },
    { name: "M49", distance: 1575000000000000, unit: "光秒", description: "室女座星系团的椭圆星系", color: "#663399", type: "galaxy" },
    { name: "M58", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的棒旋星系", color: "#800080", type: "galaxy" },
    { name: "M59", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的椭圆星系", color: "#9370DB", type: "galaxy" },
    { name: "M60", distance: 1700000000000000, unit: "光秒", description: "室女座星系团的椭圆星系", color: "#8A2BE2", type: "galaxy" },
    { name: "M61", distance: 1575000000000000, unit: "光秒", description: "室女座星系团的旋涡星系", color: "#7B68EE", type: "galaxy" },
    { name: "M84", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的透镜状星系", color: "#6A5ACD", type: "galaxy" },
    { name: "M86", distance: 1575000000000000, unit: "光秒", description: "室女座星系团的透镜状星系", color: "#9932CC", type: "galaxy" },
    { name: "M90", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的旋涡星系", color: "#8B008B", type: "galaxy" },

    // ==================== 其他星系团 ====================
    { name: "后发座星系团", distance: 10080000000000000, unit: "光秒", description: "最近的富星系团", color: "#4B0082", type: "cluster" },
    { name: "英仙座星系团", distance: 7560000000000000, unit: "光秒", description: "X射线最亮的星系团", color: "#483D8B", type: "cluster" },
    { name: "天炉座星系团", distance: 1890000000000000, unit: "光秒", description: "南天的星系团", color: "#663399", type: "cluster" },
    { name: "长蛇座星系团", distance: 5040000000000000, unit: "光秒", description: "长蛇座-半人马座超星系团", color: "#800080", type: "cluster" },
    { name: "半人马座星系团", distance: 4410000000000000, unit: "光秒", description: "南天的富星系团", color: "#9370DB", type: "cluster" },

    // ==================== 遥远星系 ====================
    { name: "M81", distance: 378000000000000, unit: "光秒", description: "大熊座的旋涡星系", color: "#8A2BE2", type: "galaxy" },
    { name: "M82", distance: 378000000000000, unit: "光秒", description: "大熊座的星爆星系", color: "#7B68EE", type: "galaxy" },
    { name: "M101", distance: 693000000000000, unit: "光秒", description: "大熊座的风车星系", color: "#6A5ACD", type: "galaxy" },
    { name: "M51", distance: 756000000000000, unit: "光秒", description: "猎犬座的漩涡星系", color: "#9932CC", type: "galaxy" },
    { name: "M104", distance: 945000000000000, unit: "光秒", description: "室女座的草帽星系", color: "#8B008B", type: "galaxy" },
    { name: "NGC4258", distance: 756000000000000, unit: "光秒", description: "猎犬座的旋涡星系", color: "#9400D3", type: "galaxy" },
    { name: "NGC253", distance: 378000000000000, unit: "光秒", description: "玉夫座的星爆星系", color: "#4B0082", type: "galaxy" },
    { name: "NGC55", distance: 220500000000000, unit: "光秒", description: "玉夫座的不规则星系", color: "#483D8B", type: "galaxy" },

    // ==================== 超大尺度结构 ====================
    { name: "本超星系团", distance: 3150000000000000, unit: "光秒", description: "包含银河系的超星系团", color: "#663399", type: "supercluster" },
    { name: "拉尼亚凯亚超星系团", distance: 15750000000000000, unit: "光秒", description: "我们所在的超星系团", color: "#800080", type: "supercluster" },
    { name: "夏普利超星系团", distance: 20160000000000000, unit: "光秒", description: "南天的超星系团", color: "#9370DB", type: "supercluster" },
    { name: "英仙-双鱼超星系团", distance: 7560000000000000, unit: "光秒", description: "附近的超星系团", color: "#8A2BE2", type: "supercluster" },
    { name: "巨引源", distance: 5040000000000000, unit: "光秒", description: "引力异常区域", color: "#7B68EE", type: "structure" },
    { name: "长城", distance: 12600000000000000, unit: "光秒", description: "星系长城结构", color: "#6A5ACD", type: "structure" },
    { name: "斯隆长城", distance: 37800000000000000, unit: "光秒", description: "宇宙最大结构之一", color: "#9932CC", type: "structure" },

    // ==================== 宇宙极限 ====================
    { name: "宇宙微波背景", distance: 435000000000000000, unit: "光秒", description: "宇宙大爆炸的余辉", color: "#191970", type: "universe" },
    { name: "可观测宇宙边缘", distance: 435000000000000000, unit: "光秒", description: "人类能观测到的宇宙极限", color: "#191970", type: "universe" },
    { name: "粒子视界", distance: 410000000000000000, unit: "光秒", description: "因果关系的极限", color: "#000080", type: "universe" },
    { name: "事件视界", distance: 465000000000000000, unit: "光秒", description: "未来可观测的极限", color: "#4B0082", type: "universe" }
];

// 全局变量存储当前结果
let currentResult = null;

// 根据等待时间计算距离并找到最匹配的天体
function calculateDistance(hours, minutes, seconds) {
    // 将时间转换为总秒数
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds === 0) {
        return null;
    }
    
    // 计算光在这段时间内传播的距离（光秒）
    const lightSeconds = totalSeconds;
    
    // 使用优化的匹配算法找到最接近的天体
    const closestBody = findClosestCelestialBody(lightSeconds);
    
    return {
        waitTime: totalSeconds,
        lightSeconds: lightSeconds,
        celestialBody: closestBody,
        actualDistance: formatDistance(lightSeconds)
    };
}

// 格式化距离显示
function formatDistance(lightSeconds) {
    if (lightSeconds < 60) {
        return `${lightSeconds.toFixed(2)} 光秒`;
    } else if (lightSeconds < 3600) {
        return `${(lightSeconds / 60).toFixed(2)} 光分`;
    } else if (lightSeconds < 86400) {
        return `${(lightSeconds / 3600).toFixed(2)} 光时`;
    } else if (lightSeconds < 31536000) {
        return `${(lightSeconds / 86400).toFixed(2)} 光天`;
    } else {
        return `${(lightSeconds / 31536000).toFixed(2)} 光年`;
    }
}

// 格式化时间显示
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let timeStr = '';
    if (hours > 0) timeStr += `${hours}小时`;
    if (minutes > 0) timeStr += `${minutes}分钟`;
    if (seconds > 0) timeStr += `${seconds}秒`;
    
    return timeStr || '0秒';
}

// 生成幽默的提醒信件
function generateLetter(playerName, gameName, result) {
    const { celestialBody, actualDistance, waitTime } = result;
    
    const templates = [
        // 原有的3个模板
        `亲爱的${playerName}，

我们荣幸地得知您已到达了【${celestialBody.name}】，这是距离地球${actualDistance}的天体。

为庆祝这一时刻，我们邀请您打一场【${gameName}】游戏。

不幸的是，您可能需要设法克服长达${formatTime(waitTime)}的网络延迟。

我们建议您考虑使用量子通信技术，或者干脆搭乘下一班光速飞船回来。

此致
游戏等待委员会
${new Date().toLocaleDateString()}`,

        `尊敬的星际旅行者${playerName}，

根据我们的精确计算，您目前的位置应该在【${celestialBody.name}】附近，距离地球约${actualDistance}。

虽然我们很佩服您的探索精神，但【${gameName}】游戏已经等待您${formatTime(waitTime)}了。

请注意，从您当前位置发送的任何消息都将经历${formatTime(waitTime)}的传输延迟。

建议您立即启动返航程序，或者至少发个信号告诉我们您还活着。

宇宙游戏协调中心
${new Date().toLocaleDateString()}`,

        `${playerName}同志，

经过精密的天体物理学计算，我们确定您已经成功抵达【${celestialBody.name}】，该天体距离地球${actualDistance}。

虽然这是人类太空探索的一大步，但这也意味着您错过【${gameName}】游戏已经${formatTime(waitTime)}了。

考虑到光速限制，我们理解您的通信延迟问题。但是，我们仍然希望您能想办法参与游戏，哪怕是通过量子纠缠的方式。

期待您的回复（预计${formatTime(waitTime)}后收到）。

地球游戏总部
${new Date().toLocaleDateString()}`,

        // 新增的5个模板
        `${playerName}船长，

🚀 紧急通讯 🚀

我们的深空雷达显示，您的飞船已成功到达【${celestialBody.name}】，${celestialBody.description}。

作为银河系游戏联盟的注册成员，您有义务参与【${gameName}】的星际锦标赛。

然而，由于您目前距离地球${actualDistance}，我们担心您的游戏手柄信号需要${formatTime(waitTime)}才能传回地球。

建议立即激活超光速通信模块，或考虑使用虫洞快速返回。

星际游戏联盟总部
舰队司令部
${new Date().toLocaleDateString()}`,

        `致：宇宙探险家${playerName}

📡 来自地球的呼叫 📡

恭喜您！您已成为第一个到达【${celestialBody.name}】的人类！NASA、SpaceX和各大游戏公司都为您感到骄傲。

但是...我们这里有个小问题。

您的【${gameName}】队友们已经在地球上等了${formatTime(waitTime)}，他们开始怀疑您是不是被外星人绑架了。

由于您目前的位置距离地球${actualDistance}，我们建议您：
1. 立即发射信号弹
2. 启动紧急返回程序
3. 或者教会当地外星人玩【${gameName}】

地球游戏救援队
${new Date().toLocaleDateString()}`,

        `【银河系失踪人员通报】

失踪者：${playerName}
最后位置：【${celestialBody.name}】（${actualDistance}）
失踪时长：${formatTime(waitTime)}
原定活动：【${gameName}】游戏聚会

各位星际公民，如果您在【${celestialBody.name}】附近发现一个拿着游戏手柄、一脸茫然的地球人，请立即联系我们。

该人员可能出现以下症状：
- 不停询问WiFi密码
- 试图用手机导航回地球
- 抱怨当地没有外卖服务

请注意：由于距离原因，救援信号需要${formatTime(waitTime)}才能到达。

银河系搜救中心
${new Date().toLocaleDateString()}`,

        `亲爱的${playerName}，

我是您的AI助手小爱，经过精确计算，我发现了一个令人震惊的事实：

您现在的位置是【${celestialBody.name}】，这里${celestialBody.description}，距离地球${actualDistance}。

虽然这个发现足以让您获得诺贝尔物理学奖，但更重要的是——您的【${gameName}】游戏已经开始${formatTime(waitTime)}了！

作为您的贴心助手，我已经为您准备了以下解决方案：
🔸 方案A：立即启动时空跳跃装置
🔸 方案B：请求外星文明提供传送门服务
🔸 方案C：发明超光速网络连接技术

温馨提示：由于物理定律限制，您的操作指令将有${formatTime(waitTime)}的延迟。

您的专属AI助手
小爱同学
${new Date().toLocaleDateString()}`,

        `【宇宙邮政特快专递】

收件人：${playerName}
地址：【${celestialBody.name}】星域
邮编：距离地球${actualDistance}

📮 您有一份来自地球的紧急邮件 📮

发件人：【${gameName}】游戏俱乐部全体成员

邮件内容：
"喂！${playerName}！你跑哪去了？！游戏都开始${formatTime(waitTime)}了！

我们知道【${celestialBody.name}】很美，${celestialBody.description}，风景一定很棒。但是你能不能先回来把游戏打完再去旅游啊？

PS：如果你在那边遇到了外星人，记得问问他们会不会玩【${gameName}】，说不定可以组个跨星系战队。

PPS：由于宇宙邮政的限制，这封邮件经过了${formatTime(waitTime)}才送到你手上，希望你收到时还记得我们是谁。"

宇宙邮政总局
${new Date().toLocaleDateString()}`
    ];
    
    // 随机选择一个模板
    return templates[Math.floor(Math.random() * templates.length)];
}

// 主要计算和生成函数
function calculateAndGenerate() {
    const playerName = document.getElementById('playerName').value.trim();
    const gameName = document.getElementById('gameName').value.trim();
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    
    // 验证输入
    if (!playerName) {
        alert('请输入朋友的名字！');
        return;
    }
    
    if (!gameName) {
        alert('请输入游戏名称！');
        return;
    }
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert('请输入等待时间！');
        return;
    }
    
    // 计算结果
    const result = calculateDistance(hours, minutes, seconds);
    
    if (!result) {
        alert('计算出错，请检查输入！');
        return;
    }
    
    // 保存当前结果到全局变量
    currentResult = {
        ...result,
        playerName,
        gameName
    };
    
    // 显示天体信息
    const celestialInfo = document.getElementById('celestialInfo');
    celestialInfo.innerHTML = `
        <h3>🌟 ${result.celestialBody.name}</h3>
        <p>${result.celestialBody.description}</p>
        <p><strong>距离地球：</strong>${result.actualDistance}</p>
        <p><strong>等待时间：</strong>${formatTime(result.waitTime)}</p>
    `;
    
    // 生成并显示信件
    const letter = generateLetter(playerName, gameName, result);
    document.getElementById('letterContent').textContent = letter;
    
    // 显示结果区域
    document.getElementById('resultSection').style.display = 'block';
    
    // 滚动到结果区域
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// 复制信件到剪贴板
async function copyLetter() {
    const letterContent = document.getElementById('letterContent').textContent;
    
    try {
        await navigator.clipboard.writeText(letterContent);
        
        // 临时改变按钮文本以显示成功
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 已复制！';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#28a745';
        }, 2000);
        
    } catch (err) {
        // 降级方案：选择文本
        const letterElement = document.getElementById('letterContent');
        const range = document.createRange();
        range.selectNode(letterElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        alert('请手动复制选中的文本');
    }
}

// 分享功能
function shareLetter() {
    const letterContent = document.getElementById('letterContent').textContent;
    const playerName = document.getElementById('playerName').value;
    const title = `给${playerName}的天体提醒信`;
    
    if (navigator.share) {
        // 使用原生分享API
        navigator.share({
            title: title,
            text: letterContent
        }).catch(err => {
            console.log('分享取消或失败:', err);
        });
    } else {
        // 降级方案：复制到剪贴板
        copyLetter();
        alert('内容已复制到剪贴板，您可以粘贴到任何地方分享！');
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 为输入框添加回车键监听
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAndGenerate();
            }
        });
    });
    
    // 添加一些示例提示
    document.getElementById('playerName').placeholder = '例如：小明、张三、游戏大神';
    document.getElementById('gameName').placeholder = '例如：王者荣耀、英雄联盟、原神';
});

// ==================== 明信片生成功能 ====================

// 绘制天体
function drawCelestialBody(ctx, body, x, y, size) {
    const { name, color, type } = body;
    
    ctx.save();
    
    switch (type) {
        case 'moon':
            // 绘制月球
            drawMoon(ctx, x, y, size, color);
            break;
        case 'star':
            // 绘制恒星
            drawStar(ctx, x, y, size, color);
            break;
        case 'planet':
            // 绘制行星
            drawPlanet(ctx, x, y, size, color, name);
            break;
        case 'galaxy':
            // 绘制星系
            drawGalaxy(ctx, x, y, size, color);
            break;
        case 'universe':
            // 绘制宇宙边缘
            drawUniverse(ctx, x, y, size, color);
            break;
    }
    
    ctx.restore();
}

// 绘制月球
function drawMoon(ctx, x, y, size, color) {
    // 主体
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 阴影和陨石坑
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size * 0.2, y + size * 0.3, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - size * 0.1, y + size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制恒星
function drawStar(ctx, x, y, size, color) {
    // 主体光芒
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, `${color}80`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 核心
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // 光芒线条
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const startX = x + Math.cos(angle) * size;
        const startY = y + Math.sin(angle) * size;
        const endX = x + Math.cos(angle) * size * 1.8;
        const endY = y + Math.sin(angle) * size * 1.8;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// 绘制行星
function drawPlanet(ctx, x, y, size, color, name) {
    // 主体
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 根据行星名称添加特殊效果
    if (name === '土星') {
        // 绘制土星环
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.5, size * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.8, size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
    } else if (name === '木星') {
        // 绘制木星条纹
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
        ctx.lineWidth = 6;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.ellipse(x, y + i * size * 0.3, size * 0.9, size * 0.1, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else if (name === '火星') {
        // 绘制火星极地冰帽
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.7, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y + size * 0.7, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加光照效果
    const lightGradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    lightGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制星系
function drawGalaxy(ctx, x, y, size, color) {
    // 螺旋星系
    ctx.save();
    ctx.translate(x, y);
    
    // 中心核心
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
    coreGradient.addColorStop(0, '#FFFF00');
    coreGradient.addColorStop(1, color);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 螺旋臂
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    for (let arm = 0; arm < 2; arm++) {
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
            const radius = (angle / (Math.PI * 4)) * size;
            const x_pos = Math.cos(angle + arm * Math.PI) * radius;
            const y_pos = Math.sin(angle + arm * Math.PI) * radius * 0.6;
            
            if (angle === 0) {
                ctx.moveTo(x_pos, y_pos);
            } else {
                ctx.lineTo(x_pos, y_pos);
            }
        }
        ctx.stroke();
    }
    
    ctx.restore();
}

// 绘制宇宙边缘
function drawUniverse(ctx, x, y, size, color) {
    // 创建宇宙背景
    const universeGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    universeGradient.addColorStop(0, color);
    universeGradient.addColorStop(0.5, '#000033');
    universeGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = universeGradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加星点
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const starX = x + (Math.random() - 0.5) * size * 2.5;
        const starY = y + (Math.random() - 0.5) * size * 2.5;
        const starSize = Math.random() * 2 + 1;
        
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制飞船
function drawSpaceship(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    // 飞船主体
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 驾驶舱
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.ellipse(size * 0.3, 0, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 引擎喷射
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.ellipse(-size * 1.2, 0, size * 0.4, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(-size * 1.4, 0, size * 0.2, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 机翼
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, -size * 0.6);
    ctx.lineTo(size * 0.2, -size * 0.2);
    ctx.lineTo(size * 0.2, size * 0.2);
    ctx.lineTo(-size * 0.5, size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// 生成HTML明信片
function generatePostcard() {
    if (!currentResult) {
        alert('请先计算天体位置！');
        return;
    }
    
    const celestialBody = currentResult.celestialBody;
    // 使用当前显示的信件内容，而不是重新生成
    const letterContent = document.getElementById('letterContent').textContent;
    
    // 创建明信片HTML内容
    const postcardHTML = `
        <div style="
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: linear-gradient(135deg, #000033 0%, #000066 50%, #000000 100%);
            color: white;
            font-family: 'Microsoft YaHei', sans-serif;
            position: relative;
            overflow: hidden;
            min-height: 900px;
        ">
            <!-- 星空背景 -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(2px 2px at 20px 30px, white, transparent),
                    radial-gradient(2px 2px at 40px 70px, white, transparent),
                    radial-gradient(1px 1px at 90px 40px, white, transparent),
                    radial-gradient(1px 1px at 130px 80px, white, transparent),
                    radial-gradient(2px 2px at 160px 30px, white, transparent),
                    radial-gradient(1px 1px at 200px 90px, white, transparent),
                    radial-gradient(2px 2px at 240px 50px, white, transparent),
                    radial-gradient(1px 1px at 280px 10px, white, transparent),
                    radial-gradient(1px 1px at 320px 70px, white, transparent),
                    radial-gradient(2px 2px at 360px 40px, white, transparent);
                background-repeat: repeat;
                background-size: 400px 200px;
                opacity: 0.8;
            "></div>
            
            <!-- 标题区域 -->
            <div style="
                background: rgba(0, 0, 0, 0.8);
                padding: 30px;
                text-align: center;
                border-bottom: 3px solid #FFD700;
                position: relative;
                z-index: 2;
            ">
                <h1 style="
                    color: #FFD700;
                    font-size: 2.5em;
                    margin: 0 0 10px 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                ">🕊️ 鸽子提醒明信片</h1>
                <p style="
                    color: white;
                    font-size: 1.1em;
                    margin: 0;
                    opacity: 0.9;
                ">基于光速计算的天体距离匹配系统</p>
            </div>
            
            <!-- 天体展示区域 -->
            <div style="
                background: rgba(0, 0, 0, 0.6);
                margin: 20px;
                padding: 30px;
                border-radius: 15px;
                border: 2px solid #87CEEB;
                position: relative;
                z-index: 2;
                display: flex;
                align-items: center;
                gap: 30px;
                flex-wrap: wrap;
            ">
                <div style="flex: 1; min-width: 300px;">
                    <h2 style="
                        color: #FFD700;
                        font-size: 1.8em;
                        margin: 0 0 15px 0;
                    ">🌟 目标天体: ${celestialBody.name}</h2>
                    <p style="
                        color: white;
                        font-size: 1.1em;
                        margin: 10px 0;
                        line-height: 1.6;
                    ">${celestialBody.description}</p>
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 15px;
                    ">
                        <p style="margin: 5px 0; color: #87CEEB;"><strong>距离地球:</strong> ${currentResult.actualDistance}</p>
                        <p style="margin: 5px 0; color: #87CEEB;"><strong>等待时间:</strong> ${formatTime(currentResult.waitTime)}</p>
                        <p style="margin: 5px 0; color: #87CEEB;"><strong>网络延迟:</strong> ${formatTime(currentResult.waitTime)}</p>
                    </div>
                </div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                ">
                    <div style="
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        background: ${celestialBody.color};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 3em;
                        box-shadow: 0 0 30px ${celestialBody.color}50;
                        animation: pulse 2s infinite;
                    ">${getCelestialEmoji(celestialBody.type)}</div>
                    <div style="
                        font-size: 2em;
                        color: #C0C0C0;
                    ">🚀</div>
                </div>
            </div>
            
            <!-- 信件内容区域 -->
            <div style="
                background: rgba(255, 255, 255, 0.95);
                margin: 20px;
                padding: 30px;
                border-radius: 15px;
                border: 2px solid #667eea;
                position: relative;
                z-index: 2;
                color: #333;
            ">
                <h3 style="
                    color: #667eea;
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    text-align: center;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 10px;
                ">📧 官方提醒信件</h3>
                <div style="
                    font-size: 1.1em;
                    line-height: 1.8;
                    white-space: pre-line;
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                ">${letterContent}</div>
            </div>
            
            <!-- 交互按钮区域 -->
            <div style="
                background: rgba(0, 0, 0, 0.9);
                padding: 30px;
                text-align: center;
                position: relative;
                z-index: 2;
            ">
                <button onclick="window.parent.resetApp ? window.parent.resetApp() : (window.opener && window.opener.resetApp ? window.opener.resetApp() : alert('请在原页面中使用此功能'))" style="
                    background: linear-gradient(45deg, #28a745, #20c997);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.2em;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
                    transition: all 0.3s;
                    border: 2px solid white;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(40, 167, 69, 0.3)'">
                    🚀 生成我的明信片
                </button>
                <p style="
                    color: #C0C0C0;
                    font-size: 0.9em;
                    margin-top: 15px;
                    opacity: 0.8;
                ">点击按钮开始制作您专属的天体提醒明信片</p>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            </style>
        </div>
    `;
    
    // 将HTML内容插入到容器中
    document.getElementById('postcardContainer').innerHTML = postcardHTML;
    
    // 显示明信片区域
    document.getElementById('postcardSection').style.display = 'block';
    
    // 滚动到明信片区域
    document.getElementById('postcardSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// 根据天体类型获取对应的emoji
function getCelestialEmoji(type) {
    const emojiMap = {
        'satellite': '🛰️',
        'moon': '🌙',
        'point': '⚡',
        'planet': '🪐',
        'asteroid': '☄️',
        'comet': '☄️',
        'cloud': '☁️',
        'star': '⭐',
        'cluster': '✨',
        'nebula': '🌌',
        'structure': '🌀',
        'galaxy': '🌌',
        'supercluster': '🌌',
        'blackhole': '🕳️',
        'universe': '🌌'
    };
    return emojiMap[type] || '⭐';
}

// 优化的天体匹配算法 - 使用二分查找
function findClosestCelestialBody(lightSeconds) {
    // 先按距离排序（如果还没排序的话）
    const sortedBodies = [...CELESTIAL_BODIES].sort((a, b) => a.distance - b.distance);
    
    let left = 0;
    let right = sortedBodies.length - 1;
    let closest = sortedBodies[0];
    let minDifference = Math.abs(sortedBodies[0].distance - lightSeconds);
    
    // 二分查找最接近的天体
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const difference = Math.abs(sortedBodies[mid].distance - lightSeconds);
        
        if (difference < minDifference) {
            minDifference = difference;
            closest = sortedBodies[mid];
        }
        
        if (sortedBodies[mid].distance < lightSeconds) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        
        // 检查相邻的天体
        if (mid > 0) {
            const leftDiff = Math.abs(sortedBodies[mid - 1].distance - lightSeconds);
            if (leftDiff < minDifference) {
                minDifference = leftDiff;
                closest = sortedBodies[mid - 1];
            }
        }
        
        if (mid < sortedBodies.length - 1) {
            const rightDiff = Math.abs(sortedBodies[mid + 1].distance - lightSeconds);
            if (rightDiff < minDifference) {
                minDifference = rightDiff;
                closest = sortedBodies[mid + 1];
            }
        }
    }
    
    return closest;
}

// 下载明信片HTML页面
function downloadPostcardHTML() {
    if (!currentResult) {
        alert('请先生成明信片！');
        return;
    }
    
    const postcardContent = document.getElementById('postcardContainer').innerHTML;
    
    // 创建完整的HTML页面
    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>鸽子提醒明信片 - ${currentResult.playerName}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-radius: 20px;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div class="container">
        ${postcardContent}
    </div>
    
    <script>
        // 重置功能 - 跳转到原始页面
        function resetApp() {
            if (confirm('要生成您的专属明信片吗？')) {
                // 尝试打开原始页面
                window.open('${window.location.origin}${window.location.pathname}', '_blank');
            }
        }
    </script>
</body>
</html>`;
    
    // 创建下载链接
    const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `鸽子提醒明信片_${currentResult.playerName}_${new Date().getTime()}.html`;
    link.click();
    
    // 清理URL对象
    URL.revokeObjectURL(link.href);
}

// 分享明信片链接
async function sharePostcardURL() {
    if (!currentResult) {
        alert('请先生成明信片！');
        return;
    }
    
    try {
        // 创建分享数据
        const shareData = {
            title: `${currentResult.playerName}的天体提醒明信片`,
            text: `${currentResult.playerName}已经到达${currentResult.celestialBody.name}了！快来看看这张有趣的明信片，并生成你自己的吧！`,
            url: window.location.href
        };
        
        if (navigator.share) {
            // 使用原生分享API
            await navigator.share(shareData);
        } else {
            // 降级方案：复制链接
            await navigator.clipboard.writeText(window.location.href);
            alert('链接已复制到剪贴板！\n\n您可以将链接分享给朋友，他们点击明信片上的按钮就能生成自己的明信片了。');
        }
    } catch (err) {
        console.error('分享失败:', err);
        // 最终降级方案
        const url = window.location.href;
        prompt('请复制下面的链接进行分享：', url);
    }
}

// 重新生成功能 - 返回初始状态
function resetApp() {
    // 清空输入框
    document.getElementById('playerName').value = '';
    document.getElementById('gameName').value = '';
    document.getElementById('hours').value = '0';
    document.getElementById('minutes').value = '0';
    document.getElementById('seconds').value = '0';
    
    // 隐藏结果区域
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('postcardSection').style.display = 'none';
    
    // 清空全局变量
    currentResult = null;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 聚焦到第一个输入框
    document.getElementById('playerName').focus();
}

// 为明信片添加点击事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为输入框添加回车键监听
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAndGenerate();
            }
        });
    });
    
    // 添加一些示例提示
    document.getElementById('playerName').placeholder = '例如：小明、张三、游戏大神';
    document.getElementById('gameName').placeholder = '例如：王者荣耀、英雄联盟、原神';
});