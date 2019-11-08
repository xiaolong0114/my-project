<template>
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
    <div :style="inputWidth" class="demo-XL">
        <div class="demo-outBox-XL" @click="chooseInput" :class="{'demo-is-focus-XL': inputFocus}">
            <span @click.stop="clearChecked">
                <img src="./assets/crossIcon.svg" class="demo-InputCloseIcon-XL" >
            </span>
            <!-- 多选 -->
            <div class="demo-chooseContent-XL" :class="{'demo-showInput-XL': !showClearIcon}" v-if="isMultiple">
                <div v-for="(item, i) in checkedArr" :key="'checked' + i" class="demo-checkedTag-XL"
                    :draggable="isDraggable && !deleteStatus"
                    @dragstart="handleDragStart($event, item)"
                    @dragover.prevent="handleDragOver($event, item)"
                    @dragenter="handleDragEnter($event, item)"
                    @dragend="handleDragEnd($event, item)"
                >
                    <div class="demo-outContent-XL" @click="chooseTag(item)" :class="{'demo-deleteStatus-XL': i === checkedArr.length - 1 && deleteStatus}">
                        <slot name="tag" v-bind:item="item">{{item[props.label]}}</slot>
                        <span @click.stop="deleteChecked(item)" class="demo-icon-XL">
                            <img src="./assets/crossIcon.svg" class="demo-tagIcon-XL" >
                        </span>
                    </div>
                </div>
                <input type="text" v-model.trim="searchVal" :placeholder="!checkedArr.length ? placeholder : ''" class="demo-inInput-XL" @focus="handleFocus" @blur="loseFocus" ref="inInput" @keydown.8="deleteOne" v-on="$listeners">
            </div>
            <!-- 单选 -->
            <div class="demo-chooseContent-XL" :class="{'demo-showInput-XL': !showClearIcon}"  v-else>
                <div class="demo-checkedTag-XL" v-if="checkedArr[props.label]">
                    <div class="demo-outContent-XL" @click="chooseTag(checkedArr)" :class="{'transparent-XL': hasFocus}" style="position: absolute;">
                        <slot name="tag" v-bind:item="checkedArr">{{checkedArr[props.label]}}</slot>
                        <span @click.stop="deleteChecked(checkedArr)" class="demo-icon-XL">
                            <img src="./assets/crossIcon.svg" class="demo-tagIcon-XL" >
                        </span>
                    </div>
                </div>
                <input type="text" v-model.trim="searchVal" :placeholder="!checkedArr[props.value] ? placeholder : ''" class="demo-inInput-XL" @focus="handleFocus" @blur="loseFocus" ref="inInput" v-on="$listeners" style="z-index: 10; background: transparent;">
            </div>
        </div>
        <div class="demo-chooseOption-XL" v-if="showOptions" :style="inputWidth">
            <div v-for="(item, i) in optionsList" :key="'option' + i" @click="chooseOption(item)">
                <slot name="option" v-bind:item="item">
                    <div class="demo-option-XL" >{{item[props.label]}}</div>
                </slot>
            </div>
            <div v-if="!optionsList.length" class="nonePeople-XL">
                {{isEN ? 'No result for search' : '没有搜索到结果'}}
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import { Component, Prop, Vue, Watch, Emit, Model } from 'vue-property-decorator';
    @Component({
        name: 'MyInput'
    })
    export default class  extends Vue {
        // 语言环境
        @Prop({type: Boolean, default: false}) private isEN!: boolean
        // 防抖延时时间
        @Prop({default: 0}) private antiShake!: any
        // 下拉框的数据
        @Prop({type: Array, default: () => { return [] }}) private options!: any[]
        // 输入框为空时是否调用父组件内容改变方法
        @Prop({type: String, default: 'false'}) private emptyReturn!: string
        // 是否多选
        @Prop({type: String, default: 'false'}) private multiple!: string
        // 是否支持拖拽
        @Prop({type: String, default: 'false'}) private draggable!: string
        // 输入框组件宽度
        @Prop({type: String, default: ''}) private width!: string
        // 下拉框和tag显示配置项
        @Prop({type: Object, default: () => { return {value: 'value', label: 'label'} }}) props!: any
        // 已选择的对象(v-model的双向绑定)
        @Model ('changeValue')  value !:  any[] | object
        private searchVal: string = ''
        private inputFocus: boolean = false
        private showClearIcon: boolean = true
        private inputWidth: object = {}
        private hasFocus: boolean = false
        private optionsList: any[] = []
        private showOptions: boolean = false
        // 暂时存储延时器 防抖
        private timeoutTemp: any = null
        // 删除前的删除状态 是否出现
        private deleteStatus: boolean = false
        get isMultiple() {
            return this.multiple === '' || this.multiple === 'true'
        }
        get isDraggable() {
            return this.draggable === '' || this.draggable === 'true'
        }
        // 输入框占位符
        get placeholder() {
            if (this.isEN) {
                return 'Search using name or email'
            } else {
                return '搜索输入姓名或邮箱'
            }
        }
        private mounted() {
            if (this.width) {
                this.inputWidth = {
                    width: this.width
                }
            }
        }
        // 选中的数组
        get checkedArr() {
            return this.value
        }
        set checkedArr(val: any) {
            this.changeValue(val)
        }
        private deleteOne() {
            if (!this.searchVal && this.checkedArr.length) {
                if (this.deleteStatus) {
                    this.checkedArr.pop()
                    this.deleteStatus = false
                } else {
                    this.deleteStatus = true
                }
            }
        }
        private changeOptionsShow() {
            this.showOptions = true
        }
        // 输入框获得焦点
        private handleFocus() {
            this.inputFocus = true
            this.showClearIcon = false
            this.hasFocus = true
        }
        // 输入框失去焦点
        private loseFocus() {
            setTimeout(() => {
                // this.inputFocus = false
                if (this.focusFlag) {
                    this.focusFlag = false
                } else {
                    this.inputFocus = false
                    this.searchVal = ''
                }
                if (this.isMultiple) {
                    this.showClearIcon = !this.checkedArr.length
                } else {
                    this.showClearIcon = !this.checkedArr[this.props.value]
                }
                this.hasFocus = false
                this.showOptions = false
                this.deleteStatus = false
            }, 500);
        }
        // 选择下拉框内容
        private focusFlag = false
        private chooseOption(val: any) {
            this.showOptions = false
            if (this.isMultiple) {
                let tempDom: any = this.$refs.inInput
                setTimeout(() => {
                    tempDom.focus()
                }, 200);
                this.focusFlag = true
                let temp: any = this.checkedArr.find((item: any) => item[this.props.value] === val[this.props.value] )
                if (temp) {
                    this.checkedArr = this.checkedArr.filter((item: any) => {
                        return item[this.props.value] !== val[this.props.value]
                    })
                } else {
                    this.checkedArr.push(val)
                }
                this.searchVal = ''
            } else {
                this.checkedArr = val
                this.searchVal = ''
                this.hasFocus = false
            }
        }
        // 选择输入框进行输入
        private chooseInput() {
            let temp: any = this.$refs.inInput
            temp.focus()
        }
        // 清空输入框中的tag
        private clearChecked() {
            let temp = this.checkedArr
            setTimeout(() => {
                this.checkedClear(temp)
            }, 0);
            if (this.isMultiple) {
                this.checkedArr = []
            } else {
                this.checkedArr = {}
            }
            this.valueChange(this.searchVal)
        }
        // 删除输入框中的tag的操作
        private deleteChecked(val: any) {
            if (this.isMultiple) {
                let temp: any = this.checkedArr.filter((item: any) => {
                    return item !== val
                })
                this.checkedArr = temp
                this.checkedDelete(val)
            } else {
                this.checkedArr = {}
                this.checkedDelete(val)
            }
        }
        // 点击输入框中的tag的操作
        private chooseTag(val: any) {
            this.clickTag(val)
        }
        // 用来修改双向绑定的选中数组的值
        @Emit('changeValue')
        changeValue(val: any) {
        }
        // 调用父组件中valueChange方法 来修改options的值
        @Emit('valueChange')
        valueChange(val: any) {}
        // 删除已选中的数组调用的方法
        @Emit('deleteChecked')
        checkedDelete(val: any) {}
        // 清空已选中的数组调用的方法
        @Emit('clearChecked')
        checkedClear(val: any) {}
        // 点击输入框的tag标签调用的方法
        @Emit('clickTag')
        clickTag(val: any) {}
        // 已选中数组改变时判断是否显示placeholder
        @Watch('checkedArr')
        checkedArrChange(newArr: any) {
            if (this.isMultiple) {
                this.showClearIcon = !this.checkedArr.length && !this.inputFocus
            } else {
                this.showClearIcon = !newArr[this.props.value] && !this.inputFocus
            }
        }
        @Watch('searchVal')
        searchValChange(newVal: any) {
            this.deleteStatus = false
            if (this.timeoutTemp) {
                clearTimeout(this.timeoutTemp)
            }
            this.timeoutTemp =  setTimeout(() => {
                this.showOptions = false
                if (newVal || this.emptyReturn === '' || this.emptyReturn === 'true') {
                    this.valueChange(this.searchVal)
                } else {
                    this.optionsList = []
                }
                this.timeoutTemp = null
            }, this.antiShake - 0);
        }
        @Watch('options')
        optionsChange(newVal: any) {
            this.optionsList = newVal
        }
        // 实现拖拽功能
        private dragging: any = null;
        private handleDragStart(e: any, item: object): void {
            this.dragging = item;
        }
        private handleDragEnd(e: any, item: object): void {
            this.dragging = null;
        }

        private handleDragOver(e: any, item: object): void {
            e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
        }

        private handleDragEnter(e: any, item: object): void {
            e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
            if (item === this.dragging) {
            return;
            }
            const newArr = [...this.checkedArr];
            const src = newArr.indexOf(this.dragging);
            const dst = newArr.indexOf(item);
            newArr.splice(dst, 0, ...newArr.splice(src, 1));
            this.checkedArr = newArr;
        }
        
    }
</script>

<style scoped>
.demo-deleteStatus-XL {
    opacity: 0.3;
}
    .demo-XL {
        background: #fff;
        margin-bottom: 16px;
        position: relative;

    }
    .demo-XL .demo-outBox-XL {
        max-height: 88px;
        /* position: relative; */
        min-height: 28px;
        outline: none;
        border: 1px solid rgba(217,217,217,1);
        border-radius: 2px;
        padding: 4px 0 0;
        cursor: text;
        overflow: auto;
        overflow-x: hidden;
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    .demo-XL .demo-outBox-XL::-webkit-scrollbar
    {
        width: 4PX;
        height: 0;
    }
    /*定义滑块 内阴影+圆角*/
    .demo-XL .demo-outBox-XL::-webkit-scrollbar-thumb
    {
        background:rgba(206,206,206,1);
        border-radius:2px;
        width: 4px;
    }
    .demo-XL .demo-outBox-XL:hover {
        border: 1px solid #3C8CFF;
    }
    .demo-XL .demo-outBox-XL:hover .demo-InputCloseIcon-XL {
        display: block;
    }
    .demo-XL .demo-is-focus-XL .demo-InputCloseIcon-XL {
        display: block;
    }
    .demo-XL .demo-placeholder-XL {
        position: absolute;
        z-index: 10;
        left: 12px;
        top: 5px;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        color: #ccc;
    }
    .demo-XL .demo-is-focus-XL.demo-outBox-XL {
        border: 1px solid #3C8CFF;
    }
    .demo-XL .demo-inInput-XL {
        height: 24px;
        min-width: 20px;
        outline: none;
        border: 0 none;
        padding: 0;
        flex: 1;
    }
    .demo-XL .demo-chooseContent-XL {
        margin-left: 12px;
        width: calc(100% - 46px);
        display: flex;
        flex-wrap: wrap;
    }
    .demo-XL .demo-chooseContent-XL.demo-showInput-XL {
        z-index: 11;
    }
    .demo-XL .demo-InputCloseIcon-XL {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 7px;
        top: 7px;
        z-index: 12;
        cursor: pointer;
        display: none;
    }
    .demo-XL .demo-checkedTag-XL {
        box-sizing: border-box;
        min-height: 24px;
        border-radius: 2px;
        margin-right: 4px;
        margin-bottom: 4px;
        background: #f5f5f5;
        font-size: 14px;
    }
    .demo-XL .demo-outContent-XL {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        cursor: pointer;
        min-height: 14px;
    }
    .demo-XL .demo-outContent-XL .demo-icon-XL {
        height: 14px;
        cursor: pointer;
        margin-left: 4px;
    }
    .demo-XL .demo-outContent-XL span .demo-tagIcon-XL {
        width: 14px;
        height: 14px;
        vertical-align: top;
    }
    .demo-XL .demo-option-XL {
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        cursor: pointer;
        padding: 0 20px;
    }
    .demo-XL .demo-option-XL:hover {
        background-color: #f5f5fa;
    }
    .demo-XL .demo-chooseOption-XL {
        box-sizing: border-box;
        position: absolute;
        max-height: 208px;
        width: 100%;
        padding: 8px 0;
        margin-top: 4px;
        box-shadow:0px 0px 4px 0px rgba(0,0,0,0.1);
        border-radius:2px;
        overflow: auto;
        overflow-x: hidden;
        background: #fff;
        z-index: 10;
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    .demo-XL .demo-chooseOption-XL::-webkit-scrollbar
    {
        width: 4PX;
        height: 0;
    }
    /*定义滑块 内阴影+圆角*/
    .demo-XL .demo-chooseOption-XL::-webkit-scrollbar-thumb
    {
        background: #CECECE;
        border-radius:2px;
        width: 4px;
    }
    .demo-XL .transparent-XL {
        opacity: 0.3;
    }
    .nonePeople-XL {
        text-align: center;
        padding: 10px 0;
        font-size:12px;
        color:rgba(216,216,216,1);
    }
</style>