<template>
    <div class="date">
        <div class="checkDate">
            <div class="leftYear" @click="prevYear"><<</div>
            <div class="left" @click="prev"><</div>
            <div class="center">{{date}}</div>
            <div class="right" @click="next">></div>
            <div class="rightYear" @click="nextYear">>></div>
        </div>
        <div class="title">
            <div v-for="item in title" :key="item + 'title'">
                {{item}}
            </div>
        </div>
        <div class="content">
            <div v-for="(item, i) in dateAll" :key="i + 'title'" @click="print(item)">
                {{item}}
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    @Component
    export default class  extends Vue {
        private title: string[] = ['日', '一', '二', '三', '四', '五', '六']
        private dateAll: string[] = []
        private date: string = ''
        private created() {
            this.getDate(new Date())
        }
        private getDate(time: any) {
            this.dateAll = []
            let temp = new Date(time)
            let month = temp.getMonth() + 1
            let date = temp.getDate()
            let year = temp.getFullYear()
            let days = 0
            this.date = year + '-' + month
            if (month === 12) {
                days = new Date(new Date(`${year + 1}-1-1`).getTime() - 1000).getDate()
            } else {
                days = new Date(new Date(`${year }-${month + 1}-1`).getTime() - 1000).getDate()
            }
            let week = new Date(`${year }-${month}-1`).getDay()
            for (let i = 0; i < week; i++) {
                this.dateAll.push('')
            }
            for (let i = 1; i <= days; i++) {
                this.dateAll.push(i +'')
            }
        }
        private next() {
            let temp = new Date(this.date)
            let month = temp.getMonth() + 1
            let year = temp.getFullYear()
            if (month === 12) {
                this.getDate(`${year + 1}-1`)
            } else {
                this.getDate(`${year}-${month + 1}`)
            }
        }
         private prev() {
            let temp = new Date(this.date)
            let month = temp.getMonth() + 1
            let year = temp.getFullYear()
            if (month === 1) {
                this.getDate(`${year - 1}-12`)
            } else {
                this.getDate(`${year}-${month - 1}`)
            }
        }
        private print(val: string) {
            alert(this.date + '-' + val)
        }
        private nextYear() {
            let temp = new Date(this.date)
            let month = temp.getMonth() + 1
            let year = temp.getFullYear()
            this.getDate(`${year + 1}-${month}`)
        }
         private prevYear() {
            let temp = new Date(this.date)
            let month = temp.getMonth() + 1
            let year = temp.getFullYear()
            this.getDate(`${year - 1}-${month}`)
        }
    }
</script>

<style>
.checkDate {
    display: flex;
    width: 700px;
}
.checkDate div {
    text-align: center;
    height: 100px;
    line-height: 98px;
    box-sizing: border-box;
    border: 1px solid #999;
}
.checkDate .leftYear {
 flex: 1;
}
.checkDate .left {
 flex: 1;
}
.checkDate .center {
 flex: 3;
}
.checkDate .right {
 flex: 1;
}
.checkDate .rightYear {
 flex: 1;
}
.title {
    display: flex;
    width: 700px;
}
.title div {
    text-align: center;
    width: 100px;
    height: 100px;
    line-height: 98px;
    box-sizing: border-box;
    border: 1px solid #999;
}
.content {
    display: flex;
    width: 700px;
    flex-wrap: wrap;
}
.content div {
    text-align: center;
    width: 100px;
    height: 100px;
    line-height: 98px;
    box-sizing: border-box;
    border: 1px solid #999;
}
</style>