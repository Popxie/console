<template>
    <div>
        <el-button @click="sendGet('get')">GET</el-button>
        <el-button type="primary">GET用时{{getTime || '0'}}</el-button>
        <el-button @click="sendGet('post')">POST</el-button>
        <el-button type="primary">POST用时{{postTime || '0'}}</el-button>

    </div>

</template>
<script>
    export default{
        data() {
        	return {
                getTime: '',
                postTime: ''
            }
        },
        methods: {
            sendGet(method) {
                let self = this,
                    beginTime = new Date().getTime(),
                    endTime = '';
                if (method == 'get') {
                    self.$http.get('/config/getAvert.html').then((res) => {
                        endTime = new Date().getTime();
                        self.getTime = endTime - beginTime;
                        console.log(endTime - beginTime);
                    }, (err) => {

                    })
                } else {
                    self.$http.post('/config/android', {}).then((res) => {
                        endTime = new Date().getTime();
                        self.postTime = endTime - beginTime;
                        console.log(endTime - beginTime);
                    }, (err) => {

                    })
                }

            }
        }
    }
</script>

