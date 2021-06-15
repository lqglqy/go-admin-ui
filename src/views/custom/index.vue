<template>
<BasicLayout>
    <template #wrapper>
        <el-card class="box-card">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                <el-form-item label="规则名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入规则名称" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button v-permisaction="['admin:custom:add']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-permisaction="['admin:custom:edit']" type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-permisaction="['admin:custom:remove']" type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
                    </el-button>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="customList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="编码" align="center" prop="id" :show-overflow-tooltip="true" />
                <el-table-column label="规则名称" align="center" prop="name" :show-overflow-tooltip="true" />
                <el-table-column label="规则内容" align="center" prop="content" :show-overflow-tooltip="true" />
                <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permisaction="['admin:custom:edit']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改
                        </el-button>
                        <el-button v-permisaction="['admin:custom:remove']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改对话框 -->
            <el-dialog :title="title" :visible.sync="open" style="width:75%">
                <!--
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        
                                    <el-form-item label="规则名称" prop="name">
                                        <el-input v-model="form.name" placeholder="规则名称"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="规则内容" prop="content">
                                        <el-input v-model="form.content" placeholder="规则内容"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="状态" prop="status">
                                        <el-input v-model="form.status" placeholder="状态"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="创建时间" prop="createdAt">
                                        <el-date-picker
                                                    v-model="form.createdAt"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="更新时间" prop="updatedAt">
                                        <el-date-picker
                                                    v-model="form.updatedAt"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="删除时间" prop="deletedAt">
                                        <el-date-picker
                                                    v-model="form.deletedAt"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="创建者" prop="createBy">
                                        <el-input v-model="form.createBy" placeholder="创建者"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="更新者" prop="updateBy">
                                        <el-input v-model="form.updateBy" placeholder="更新者"
                                                      />
                                    </el-form-item>
                    </el-form>
                    -->
                <!--
                <el-row :gutter="0">
                    <el-form ref="elForm" :model="form" :rules="rules" size="medium" label-width="100px" label-position="top">
                            <el-col :span="24">
                                <el-row>
                                    <el-col :span="10">
                                        <el-form-item label="规则名称" prop="rule_name_i">
                                            <el-input v-model="form.rule_name_i" placeholder="请输入规则名称" clearable :style="{width: '100%'}"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="" prop="fieldoperator">
                                    <el-cascader v-model="form.fieldoperator" :options="fieldoperatorOptions" :props="fieldoperatorProps" :style="{width: '100%'}" placeholder="请选择" clearable></el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="17">
                                <el-form-item label="" prop="pattern">
                                    <el-input v-model="form.pattern" placeholder="请输入" clearable :style="{width: '100%'}">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <div v-for="(item, index) in form.dynamicItem" :key="index">
                                <el-col :span="5">
                                  
                                    <el-form-item label="" prop="'dynamicItem.' + index + '.fieldoperator'">
                                        <el-cascader v-model="item.fieldoperator" :options="item.fieldoperatorOptions" :props="item.fieldoperatorProps" :style="{width: '100%'}" placeholder="请选择" clearable></el-cascader>
                                    </el-form-item>
                                    
                                </el-col>
                                <el-col :span="17">
                                    <el-form-item label="" 
                                    :prop="'form.dynamicItem.'+index+'.pattern'">
                                        <el-input v-model="item.pattern" placeholder="请输入" clearable :style="{width: '100%'}"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-form-item>
                                    <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
                                </el-form-item>
                            </div>
                            <el-col :span="3">
                                <el-form-item label="" prop="and_b">
                                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="addItem"> And </el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label="" prop="or_b">
                                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="addItem"> Or </el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="表达式" prop="express_mi">
                                    <el-input v-model="form.express_mi" type="textarea" readonly :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="执行动作" prop="action_s">
                                    <el-select v-model="form.action_s" placeholder="请选择执行动作" clearable :style="{width: '100%'}">
                                        <el-option v-for="(item, index) in action_sOptions" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                    </el-form>
                </el-row>-->
                <dynamic-form
                    v-model="data"
                    :descriptors="descriptors"
                    :lang="lang"
                  >
                </dynamic-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-dialog>
            <FileChoose ref="fileChoose" :dialog-form-visible="fileOpen" @confirm="getImgList" @close="fileClose" />
        </el-card>
    </template>
</BasicLayout>
</template>

<script>
import {
    addCustom,
    delCustom,
    getCustom,
    listCustom,
    updateCustom
} from '@/api/custom'
import FileChoose from '@/components/FileChoose'
import DynamicForm from 'vue-dynamic-form-component'

export default {
    name: 'Custom',
    components: {
        FileChoose,
        DynamicForm
    },
    props: ['lang'],
    data() {
        return {
            descriptors: {
                ruleName: { type: 'string', label: '规则名称', required: true },
                ruleArray: {
                    type: 'array',
                    label: '规则组',
                    defaultField: {
                        type: 'object',
                        fields: {
                            fieldsOperator: {
                                type: 'enum',
                                label: '匹配方式',
                                enum: ['ip eq', 'ip in', 'ip ne','not ip in'],
                                options: [
                                    { label: 'ip等于', value: 'ip eq' },
                                    { label: 'ip包含', value: 'ip in' },
                                    { label: 'ip不等于', value: 'ip ne' },
                                    { label: 'ip不包含', value: 'not ip in' }
                                ]
                            },
                            values: { type: 'string', label: '匹配内容', required: true},
                            ruleArray: {
                                type: 'array',
                                label: 'And',
                                defaultField: {
                                    type: 'object',
                                    fields: {
                                        fieldsOperator: {
                                            type: 'enum',
                                            label: '匹配方式',
                                            enum: ['ip eq', 'ip in', 'ip ne','not ip in'],
                                            options: [
                                                { label: 'ip等于', value: 'ip eq' },
                                                { label: 'ip包含', value: 'ip in' },
                                                { label: 'ip不等于', value: 'ip ne' },
                                                { label: 'ip不包含', value: 'not ip in' }
                                            ] 
                                        },
                                        values: { type: 'string', label: '匹配内容', required: true},
                                    }
                                }
                            }
                        }
                    }
                },
                action: {
                    type: 'enum',
                    enum: ["deny", "allow", "watch"],
                    options: [
                        { label: 'Deny', value: "deny" },
                        { label: 'Allow', value: "allow" },
                        { label: 'Watch', value: "watch" }
                    ],
                },
            },
            data: {},
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            isEdit: false,
            fileOpen: false,
            fileIndex: undefined,
            // 类型数据字典
            typeOptions: [],
            customList: [],

            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                name: undefined,

            },
            // 表单参数
            form: {
                rule_name_i: undefined,
                fieldoperator: [],
                pattern: undefined,
                and_b: undefined,
                or_b: undefined,
                express_mi: undefined,
                action_s: 1,
                dynamicItem: [],
            },
            // 表单校验
            rules: {
                id: [{
                    required: true,
                    message: '编码不能为空',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '规则名称不能为空',
                    trigger: 'blur'
                }],
                content: [{
                    required: true,
                    message: '规则内容不能为空',
                    trigger: 'blur'
                }],
                rule_name_i: [{
                    required: true,
                    message: '请输入规则名称',
                    trigger: 'blur'
                }],
                fieldoperator: [{
                    required: true,
                    type: 'array',
                    message: '请至少选择一个',
                    trigger: 'change'
                }],
                pattern: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                express_mi: [{
                    required: true,
                    message: '',
                    trigger: 'blur'
                }],
                action_s: [{
                    required: true,
                    message: '请选择执行动作',
                    trigger: 'change'
                }],
            },
            fieldoperatorOptions: [{
                    "label": "IP源地址",
                    "value": "ip",
                    "id": 102,
                    "children": [{
                        "label": "等于",
                        "value": "eq",
                        "id": 103
                    }, {
                        "label": "不等于",
                        "value": "ne",
                        "id": 104
                    }, {
                        "label": "包含",
                        "value": "in",
                        "id": 105
                    }]
                }, {
                    "label": "Host",
                    "value": "Host",
                    "id": 106,
                    "children": [{
                        "label": "等于",
                        "value": "Host eq",
                        "id": 107
                    }]
                }],
                action_sOptions: [{
                    "label": "阻断",
                    "value": 1
                }, {
                    "label": "放行",
                    "value": 2
                }, {
                    "label": "观察",
                    "value": ""
                }],
                fieldoperatorProps: {
                    "multiple": false,
                    "label": "label",
                    "value": "value",
                    "children": "children"
                },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        addItem() {
            var _this = this;
            this.form.dynamicItem.push({
               fieldoperator: [],
               pattern: undefined,
            })
        },
        deleteItem(item, index) {
            this.form.dynamicItem.splice(index, 1)
        },
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listCustom(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.customList = response.data.list
                this.total = response.data.count
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {
                rule_name_i: undefined,
                fieldoperator: [],
                pattern: undefined,
                and_b: undefined,
                or_b: undefined,
                express_mi: undefined,
                action_s: 1,
                dynamicItem: []
            }
            this.resetForm('form')
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        fileClose: function () {
            this.fileOpen = false
        },
        // 关系
        // 文件
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageIndex = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = []
            this.resetForm('queryForm')
            this.handleQuery()
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加自定义规则'
            this.isEdit = false
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id =
                row.id || this.ids
            getCustom(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改自定义规则'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            console.log(this.data)
            var ruleName = this.data.ruleName
            var action = this.data.action 
            var rules = "";
            var ruleCount = 0;
            
            this.data.ruleArray.forEach(printRules);

            function printRules(item) {
                var subRules = '(' + item.fieldsOperator + ' ' + item.values
                item.ruleArray.forEach(printSubRuels);
                function printSubRuels(item) {
                    subRules = subRules + " and " + item.fieldsOperator + ' ' + item.values 
                    //console.log("subRule:" + subRules+" Count:"+subCount)
                }
                subRules = subRules + ')'
                if ( ruleCount != 0 ) {
                    rules = rules + " or " + subRules 
                } else {
                    rules = subRules
                }
                //console.log("rules:"+rules+" count:"+ruleCount)
                ruleCount++
            }
            console.log(rules)
            this.form.name = ruleName
            this.form.content = rules
            this.form.action = action
            this.form.status = "1"
            if (this.form.id !== undefined) {
                updateCustom(this.form).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess('修改成功')
                        this.open = false
                        this.getList()
                    } else {
                        this.msgError(response.msg)
                    }
                })
            } else {
                addCustom(this.form).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess('新增成功')
                        this.open = false
                        this.getList()
                    } else {
                        this.msgError(response.msg)
                    }
                })
            }
            /*
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateCustom(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess('修改成功')
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addCustom(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess('新增成功')
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    }
                }
            })*/
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            var Ids = (row.id && [row.id]) || this.ids

            this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return delCustom({
                    'ids': Ids
                })
            }).then(() => {
                this.getList()
                this.msgSuccess('删除成功')
            }).catch(function () {})
        }
    }
}
</script>
