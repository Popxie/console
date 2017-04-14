<template>
    <div>
        <el-button :type="btnType" @click="downloadExl()">导出</el-button>
        <a href="" :download="excelName" id="hf"></a>
    </div>
</template>
<script>
    export default{
        data() {
            return {}
        },
        props: {
            btnType: {
                type: String,
                default: ''
            },
            excelData: {
                type: Array,
                require: true
            },
            excelName: {
                type: String,
                require: true
            }
        },
        computed: {},
        methods: {
            downloadExl(type) {
                let self = this,
                    tmpDown;
                let json = self.excelData;
                let keyMap = [];//获取键
                for (let k in json[0]) {
                    keyMap.push(k);
                }
                let tmpdata = [];//用来保存转换好的json
                json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                    v: v[k],
                    position: (j > 25 ? self.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
                    v: v.v
                });
                let outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
                let tmpWB = {
                    SheetNames: ['mySheet'], //保存的表标题
                    Sheets: {
                        'mySheet': Object.assign({},
                            tmpdata, //内容
                            {
                                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                            })
                    }
                };
                tmpDown = new Blob([self.s2ab(XLSX.write(tmpWB,
                    {bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
                ))], {
                    type: ""
                }); //创建二进制对象写入转换好的字节流
                let href = URL.createObjectURL(tmpDown); //创建对象超链接
                document.getElementById("hf").href = href; //绑定a标签
                document.getElementById("hf").click(); //模拟点击实现下载
                setTimeout(function () { //延时释放
                    URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
                }, 100);

            },
            //字符串转字符流
            s2ab(s) {
                let buf = new ArrayBuffer(s.length);
                let view = new Uint8Array(buf);
                for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            },
            // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
            getCharCol() {
                let temCol = '',
                    s = '',
                    m = 0
                while (n > 0) {
                    m = n % 26 + 1
                    s = String.fromCharCode(m + 64) + s
                    n = (n - m) / 26
                }
                return s
            }
        },
        mounted() {
            let script = document.createElement('script');
            script.src = 'https://activity.mingbikes.com/public/js/lib/xlsx.core.min.js';
            let header = document.getElementsByTagName("head");
            header[0].appendChild(script);
        }
    }
</script>
<style>

</style>
