<template>
    <div>
        -------input-------
        <hr>
        <!--
            * deleteChecked方法在删除输入框中的一个tag标签时触发   参数为被删除的对象
            * clearChecked方法在清空输入框中的所有tag标签时触发   参数为删除前的数组单选时为对象
            * valueChange方法在输入框内容发生改变时触发  参数为输入框修改后的值 在输入框内容变为空时并不会触发，需要触发则加上 emptyReturn 或 emptyReturn="true"
            * clickTag方法在点击输入框中的tag时触发  参数为点击的tag的对象
            * v-model双向绑定的为选中的数组
            * options为下拉框渲染数据用的数组单选时为对象
            * multiple为输入框是否为多选 只在标签上写multiple 或写 multiple="true"则为多选，其他情况均为单选  默认为单选
            * draggable为输入框是否为多选 只在标签上写draggable 或写 draggable="true"则为多选，其他情况均为单选  默认为单选
            * width为输入框宽度  默认为100%
            * tag插槽为输入框中已选中对象的展现样式，slot-scope=“{ item }” 接收的为选中的对象，默认为只显示item中label
            * option插槽为下拉选择框的展现样式，slot-scope=“{ item }” 接收的为选中的对象，默认为只显示item中label
            * props为配置选项包含以下内容：
                    参数	            说明	               类型        默认值
                    value	指定选项的值为选项对象的某个属性值	string		'value'
                    label	指定选项标签为选项对象的某个属性值	string		'label'
            * 支持事件： input  focus  blur  change  keyup keydown 等所有适用于input的事件
            * isEN为是否为英文环境 true 为英文 不传或false 为中文
            * antiShake为输入框内容改变的防抖时间 antiShake="200"  单位为ms  不传则默认为0
            * 调用子组件的changeOptionsShow方法可以显示搜索结果
        -->
        <DefaultInput v-model="arr" @valueChange="valueChange" :options="options" multiple draggable :isEN="false" width="400px" :props="props" ref="myInput">
            <template slot="tag" slot-scope="{ item }">
                <img src="./img.jpg" style="width: 16px; height: 16px; border-radius: 50%;">
                <div style="line-height: 14px; font-size: 14px; margin-left:4px; word-wrap: break-word; word-break: break-word;">
                    {{item.name}}
                </div>
            </template>
            <template slot="option" slot-scope="{ item }">
                <div class="optionStyle">
                    <img class="headPortrait" src="./img.jpg">
                    <div class="right">
                        <div class="top">
                            <div class="name" v-html="item.newname"></div>
                            <div class="email">{{item.email}}</div>
                        </div>
                        <div class="bottom">{{item.department}}</div>
                    </div>
                </div>
            </template>
        </DefaultInput>


    </div>
</template>

<script lang='ts'>
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    @Component({})
    export default class extends Vue {
        private list: any[] = [
            {name: '01胖弟弟', email: '1111@qq.com', department: 'oneone', id: 1},
            {name: '02五五开', email: '2222@qq.com', department: 'twotwo', id: 2},
            {name: '03孙亚龙', email: '3333@qq.com', department: 'threethree', id: 3},
            {name: '04卢本伟', email: '4444@qq.com', department: 'fourfour', id: 4},
            {name: '05卡卡西', email: '5555@qq.com', department: 'fivefive', id: 5},
            {name: '06大蛇丸', email: '6666@qq.com', department: 'fivefive', id: 6},
            {name: '07自来也', email: '7777@qq.com', department: 'fivefive', id: 7},
            {name: '08鸣人', email: '7777@qq.com', department: 'fivefive', id: 8},
            {name: '09佐助', email: '7777@qq.com', department: 'fivefive', id: 9},
            {name: '10小樱', email: '7777@qq.com', department: 'fivefive', id: 10},
            {name: '11宁次', email: '7777@qq.com', department: 'fivefive', id: 11},
            {name: '12小李', email: '7777@qq.com', department: 'fivefive', id: 12}
        ]
        private props: object = {
            value: 'id',
            label: 'name'
        }
        private arr: any = []
        private options: any[] = []
        private valueChange(val: string) {
            if (val === '') {
                this.options = []
                return
            }
            this.options = this.list.filter(item => {
                return item.name.includes(val)
            })
            this.options = this.options.map(item => {
                item.newname = item.name
                item.newname = item.newname.replace(new RegExp(val, 'g'), `<span style="color: #3C8CFF;">${val}</span>`)
                return item
            })
            let temp: any = this.$refs.myInput
            temp.changeOptionsShow()
        }
    }
</script>

<style scoped>
.optionStyle {
    display: flex;
    align-items: center;
    padding: 0 12px;
    min-height: 48px;
    cursor: pointer;
}
.optionStyle:hover {
    background-color: #f5f7fa;
}
.optionStyle .headPortrait {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
.optionStyle .right {
    padding: 7px 0 7px 12px;
}
.optionStyle .top {
    display: flex;
    flex-wrap: wrap;
    min-height: 18px;
    margin-bottom: 2px;
}
.optionStyle .bottom {
    min-height: 14px;
    line-height: 14px;
    font-size: 12px;
}
.optionStyle .top .name{
    font-size: 14px;
    line-height: 14px;
    margin-right: 8px;
}
.optionStyle .top .email{
    line-height: 12px;
    font-size: 12px;
}
</style>