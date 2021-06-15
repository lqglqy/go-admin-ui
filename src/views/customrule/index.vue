
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="编号" prop="id"><el-input v-model="queryParams.id" placeholder="请输入编号" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="规则名称" prop="name"><el-input v-model="queryParams.name" placeholder="请输入规则名称" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="规则内容" prop="content"><el-input v-model="queryParams.content" placeholder="请输入规则内容" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="执行动作" prop="action"><el-input v-model="queryParams.action" placeholder="请输入执行动作" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="状态" prop="status"><el-input v-model="queryParams.status" placeholder="请输入状态" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:customrule:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:customrule:edit']"
                                type="success"
                                icon="el-icon-edit"
                                size="mini"
                                :disabled="single"
                                @click="handleUpdate"
                        >修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:customrule:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="customruleList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="编号" align="center" prop="id"
                                                 :show-overflow-tooltip="true"/><el-table-column label="规则名称" align="center" prop="name"
                                                 :show-overflow-tooltip="true"/><el-table-column label="规则内容" align="center" prop="content"
                                                 :show-overflow-tooltip="true"/><el-table-column label="执行动作" align="center" prop="action"
                                                 :show-overflow-tooltip="true"/><el-table-column label="状态" align="center" prop="status"
                                                 :show-overflow-tooltip="true"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button
                                    v-permisaction="['admin:customrule:edit']"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)"
                            >修改
                            </el-button>
                            <el-button
                                    v-permisaction="['admin:customrule:remove']"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-delete"
                                    @click="handleDelete(scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                        v-show="total>0"
                        :total="total"
                        :page.sync="queryParams.pageIndex"
                        :limit.sync="queryParams.pageSize"
                        @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" style="width:80%">
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
                                    <el-form-item label="执行动作" prop="action">
                                        <el-input v-model="form.action" placeholder="执行动作"
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
                    </el-form>-->
                    <dynamic-form
                        ref="dynamicform"
                        v-model="data"
                        :descriptors="descriptors"
                        :lang="lang">
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
    import {addCustomRule, delCustomRule, getCustomRule, listCustomRule, updateCustomRule} from '@/api/customrule'
    import FileChoose from '@/components/FileChoose'
    import DynamicForm from 'vue-dynamic-form-component'

    export default {
        name: 'CustomRule',
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
                        label: '规则组(外层为<或>关系)',
                        required: true,
                        defaultField: {
                            message: 'OR',
                            type: 'object',
                            fields: {
                                fieldsOperator: {
                                    type: 'enum',
                                    label: '匹配方式',
                                    required: true,
                                    enum: ['ip.src eq', 'ip.src in', 'ip.src ne','not ip.src in',
                                            'http.host eq','http.host ne','http.host matches','not http.host matches',
                                            'http.referer eq','http.referer ne','http.referer matches','not http.referer matches',
                                            'http.user_agent eq','http.user_agent ne','http.user_agent matches','not http.user_agent matches',
                                            'http.request.uri eq','http.request.uri ne','http.request.uri matches','not http.request.uri matches',
                                            'http.request.uri.path eq','http.host ne','http.host matches','not http.host matches',
                                            'http.request_method eq','http.request_method ne','http.request_method matches','not http.request_method matches',
                                            'http.cookie eq','http.cookie ne','http.cookie matches','not http.cookie matches',
                                            'http.x_forwarded_for eq','http.x_forwarded_for ne','http.x_forwarded_for matches','not http.x_forwarded_for matches',
                                            'http.version eq','http.version ne','http.version matches','not http.version matches',
                                            'http.request.body eq','http.request.body ne','http.request.body matches','not http.request.body matches',
                                    ],
                                    options: [
                                        { label: '源ip等于', value: 'ip.src eq' },
                                        { label: '源ip不等于', value: 'ip.src ne' },
                                        { label: '源ip包含列表', value: 'ip.src in' },
                                        { label: '源ip不包含列表', value: 'not ip.src in' },

                                        { label: 'Host等于', value: 'http.host eq' },
                                        { label: 'Host不等于', value: 'http.host ne' },
                                        { label: 'Host正则匹配', value: 'http.host matches' },
                                        { label: 'Host正则不匹配', value: 'not http.host matches' },

                                        { label: 'Referer等于', value: 'http.referer eq' },
                                        { label: 'Referer不等于', value: 'http.referer ne' },
                                        { label: 'Referer正则匹配', value: 'http.referer matches' },
                                        { label: 'Referer正则不匹配', value: 'not http.referer matches' },

                                        { label: 'User-Agent等于', value: 'http.user_agent eq' },
                                        { label: 'User-Agent不等于', value: 'http.user_agent ne' },
                                        { label: 'User-Agent正则匹配', value: 'http.user_agent matches' },
                                        { label: 'User-Agent正则不匹配', value: 'not http.user_agent matches' },

                                        { label: 'URI等于', value: 'http.request.uri eq' },
                                        { label: 'URI不等于', value: 'http.request.uri ne' },
                                        { label: 'URI正则匹配', value: 'http.request.uri matches' },
                                        { label: 'URI正则不匹配', value: 'not http.request.uri matches' },

                                        { label: 'URI-Path等于', value: 'http.request.uri.path eq' },
                                        { label: 'URI-Path不等于', value: 'http.request.uri.path ne' },
                                        { label: 'URI-Path正则匹配', value: 'http.request.uri.path matches' },
                                        { label: 'URI-Path正则不匹配', value: 'not http.request.uri.path matches' },

                                        { label: 'Method等于', value: 'http.request.method eq' },
                                        { label: 'Method不等于', value: 'http.request.method ne' },
                                        { label: 'Method正则匹配', value: 'http.request.method matches' },
                                        { label: 'Method正则不匹配', value: 'not http.request.method matches' },

                                        { label: 'Cookie等于', value: 'http.cookie eq' },
                                        { label: 'Cookie不等于', value: 'http.cookie ne' },
                                        { label: 'Cookie正则匹配', value: 'http.cookie matches' },
                                        { label: 'Cookie正则不匹配', value: 'not http.cookie matches' },

                                        { label: 'X-Forwarded-For等于', value: 'http.x_forwarded_for eq' },
                                        { label: 'X-Forwarded-For不等于', value: 'http.x_forwarded_for ne' },
                                        { label: 'X-Forwarded-For正则匹配', value: 'http.x_forwarded_for matches' },
                                        { label: 'X-Forwarded-For正则不匹配', value: 'not http.x_forwarded_for matches' },

                                        { label: 'Version等于', value: 'http.version eq' },
                                        { label: 'Version不等于', value: 'http.version ne' },
                                        { label: 'Version正则匹配', value: 'http.version matches' },
                                        { label: 'Version正则不匹配', value: 'not http.version matches' },

                                        { label: 'Request-Body等于', value: 'http.request.body eq' },
                                        { label: 'Request-Body不等于', value: 'http.request.body ne' },
                                        { label: 'Request-Body正则匹配', value: 'http.request.body matches' },
                                        { label: 'Request-Body正则不匹配', value: 'not http.request.body matches' },
                                    ]
                                },
                                values: { type: 'string', label: '匹配内容', required: true, message: '源ip列表请用空格分隔;'},
                                ruleArray: {
                                    type: 'array',
                                    label: 'And',
                                    defaultField: {
                                        type: 'object',
                                        fields: {
                                            fieldsOperator: {
                                                type: 'enum',
                                                label: '匹配方式',
                                                required: true,
                                                enum: ['ip.src eq', 'ip.src in', 'ip.src ne','not ip.src in',
                                                       //'http.host eq','http.host ne','http.host contains','not http.host contains','http.host in','not http.host in','http.host matches','not http.host matches',
                                                       'http.host eq','http.host ne','http.host matches','not http.host matches',
                                                       'http.referer eq','http.referer ne','http.referer matches','not http.referer matches',
                                                       'http.user_agent eq','http.user_agent ne','http.user_agent matches','not http.user_agent matches',
                                                       'http.request.uri eq','http.request.uri ne','http.request.uri matches','not http.request.uri matches',
                                                       'http.request.uri.path eq','http.host ne','http.host matches','not http.host matches',
                                                       'http.request_method eq','http.request_method ne','http.request_method matches','not http.request_method matches',
                                                       'http.cookie eq','http.cookie ne','http.cookie matches','not http.cookie matches',
                                                       'http.x_forwarded_for eq','http.x_forwarded_for ne','http.x_forwarded_for matches','not http.x_forwarded_for matches',
                                                       'http.version eq','http.version ne','http.version matches','not http.version matches',
                                                       'http.request.body eq','http.request.body ne','http.request.body matches','not http.request.body matches',
                                                ],
                                                options: [
                                                    { label: 'ip等于', value: 'ip.src eq' },
                                                    { label: 'ip不等于', value: 'ip.src ne' },
                                                    { label: 'ip包含', value: 'ip.src in' },
                                                    { label: 'ip不包含', value: 'not ip.src in' },

                                                    
                                                    //{ label: 'Host包含', value: 'http.host contains' },
                                                    //{ label: 'Host不包含', value: 'not http.host contains' },
                                                    //{ label: 'Host包含列表', value: 'http.host in' },
                                                    //{ label: 'Host不包含列表', value: 'not http.host in' },

                                                    { label: 'Host等于', value: 'http.host eq' },
                                                    { label: 'Host不等于', value: 'http.host ne' },
                                                    { label: 'Host正则匹配', value: 'http.host matches' },
                                                    { label: 'Host正则不匹配', value: 'not http.host matches' },

                                                    { label: 'Referer等于', value: 'http.referer eq' },
                                                    { label: 'Referer不等于', value: 'http.referer ne' },
                                                    { label: 'Referer正则匹配', value: 'http.referer matches' },
                                                    { label: 'Referer正则不匹配', value: 'not http.referer matches' },

                                                    { label: 'User-Agent等于', value: 'http.user_agent eq' },
                                                    { label: 'User-Agent不等于', value: 'http.user_agent ne' },
                                                    { label: 'User-Agent正则匹配', value: 'http.user_agent matches' },
                                                    { label: 'User-Agent正则不匹配', value: 'not http.user_agent matches' },

                                                    { label: 'URI等于', value: 'http.request.uri eq' },
                                                    { label: 'URI不等于', value: 'http.request.uri ne' },
                                                    { label: 'URI正则匹配', value: 'http.request.uri matches' },
                                                    { label: 'URI正则不匹配', value: 'not http.request.uri matches' },

                                                    { label: 'URI-Path等于', value: 'http.request.uri.path eq' },
                                                    { label: 'URI-Path不等于', value: 'http.request.uri.path ne' },
                                                    { label: 'URI-Path正则匹配', value: 'http.request.uri.path matches' },
                                                    { label: 'URI-Path正则不匹配', value: 'not http.request.uri.path matches' },

                                                    { label: 'Method等于', value: 'http.request.method eq' },
                                                    { label: 'Method不等于', value: 'http.request.method ne' },
                                                    { label: 'Method正则匹配', value: 'http.request.method matches' },
                                                    { label: 'Method正则不匹配', value: 'not http.request.method matches' },

                                                    { label: 'Cookie等于', value: 'http.cookie eq' },
                                                    { label: 'Cookie不等于', value: 'http.cookie ne' },
                                                    { label: 'Cookie正则匹配', value: 'http.cookie matches' },
                                                    { label: 'Cookie正则不匹配', value: 'not http.cookie matches' },

                                                    { label: 'X-Forwarded-For等于', value: 'http.x_forwarded_for eq' },
                                                    { label: 'X-Forwarded-For不等于', value: 'http.x_forwarded_for ne' },
                                                    { label: 'X-Forwarded-For正则匹配', value: 'http.x_forwarded_for matches' },
                                                    { label: 'X-Forwarded-For正则不匹配', value: 'not http.x_forwarded_for matches' },

                                                    { label: 'Version等于', value: 'http.version eq' },
                                                    { label: 'Version不等于', value: 'http.version ne' },
                                                    { label: 'Version正则匹配', value: 'http.version matches' },
                                                    { label: 'Version正则不匹配', value: 'not http.version matches' },

                                                    { label: 'Request-Body等于', value: 'http.request.body eq' },
                                                    { label: 'Request-Body不等于', value: 'http.request.body ne' },
                                                    { label: 'Request-Body正则匹配', value: 'http.request.body matches' },
                                                    { label: 'Request-Body正则不匹配', value: 'not http.request.body matches' },
                                                ] 
                                            },
                                            values: { type: 'string', label: '匹配内容', required: true, message: '源ip列表请用空格分隔;'},
                                        }
                                    }
                                }
                            }
                        }
                    },
                    action: {
                        type: 'enum',
                        required: true,
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
                customruleList: [],
                
                // 关系表类型
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    id:undefined,
                    name:undefined,
                    content:undefined,
                    action:undefined,
                    status:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {id:
                [
                    {required: true, message: '编号不能为空', trigger: 'blur'}
                ],
                name:
                [
                    {required: true, message: '规则名称不能为空', trigger: 'blur'}
                ],
                content:
                [
                    {required: true, message: '规则内容不能为空', trigger: 'blur'}
                ],
                action:
                [
                    {required: true, message: '执行动作不能为空', trigger: 'blur'}
                ],
                }
        }
        },
        created() {
            this.getList()
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listCustomRule(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.customruleList = response.data.list
                        this.total = response.data.count
                        this.loading = false
                    }
                )
            },
            // 取消按钮
            cancel() {
                this.open = false
                this.reset()
            },
            // 表单重置
            reset() {
                this.form = {
                    id: undefined,
                    name: undefined,
                    content: undefined,
                    action: undefined,
                    status: undefined,
                }
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
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
                this.$nextTick(()=>{ this.$refs['dynamicform'].resetFields(); });
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
                //this.data = {}
                //this.$refs['dynamicform'].resetFields()
                //this.$refs['dynamicform'].resetFields()
                const id =
                row.id || this.ids
                getCustomRule(id).then(response => {
                    console.log(response.data)
                    var data = response.data
                    this.data.ruleName = data.name
                    this.data.action = data.action
                    String.prototype.trim = function (char, type) {
                        if (char) {
                        
                            if (type == 'left') {
                        
                            return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
                        
                            } else if (type == 'right') {
                        
                            return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
                        
                            }
                        
                            return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
                        
                        }
                        
                        return this.replace(/^\s+|\s+$/g, '');
                    };
                    var rules = data.content
                    var ruleArray = rules.split("or")
                    var orRuleArr = []
                    for (let i=0; i < ruleArray.length; i++) {
                        var termStr = ruleArray[i].trim()
                        console.log(termStr)
                        termStr.match(/\((.+)\)/g)
                        console.log(RegExp.$1)
                        var orRuleTrim = RegExp.$1 
                        var subRuleArray = orRuleTrim.split("and")
                        var andRuleArr = []
                        for (let j=0; j < subRuleArray.length; j++) {
                            var segs = subRuleArray[j].trim().split(' ')
                            var end = 2
                            if (segs.length > 3) {
                                end = 3
                            }
                            var r = {fieldsOperator: segs.slice(0,end).join(' '), 
                                     values: segs.slice(end).join(' ')}
                            andRuleArr.push(r)
                        }
                        var subRules = {fieldsOperator: andRuleArr[0].fieldsOperator,
                                        values: andRuleArr[0].values,
                                        ruleArray: andRuleArr.slice(1)}
                        orRuleArr.push(subRules)

                    }
                    this.data.ruleArray = orRuleArr
                    //this.form = response.data
                    this.form.id = data.id
                    this.title = '修改自定义规则'
                    this.open = true
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                console.log(this.data)
                //this.$refs['dynamicform'].validate()
                var ruleName = this.data.ruleName
                var action = this.data.action 
                var rules = "";
                var ruleCount = 0;
                
                this.data.ruleArray.forEach(printRules);

                function printValues(item) {
                    var values = item.values
                    console.log(item.fieldsOperator)
                    if (item.fieldsOperator == 'ip.src eq' || 
                        item.fieldsOperator == 'ip.src ne' ) 
                    {

                    } else if(item.fieldsOperator == 'ip.src in' || 
                        item.fieldsOperator == 'not ip.src in' ) 
                    {
                        values = '{' + values + '}'
                    } else {
                        values = '"' + values + '"'
                    }

                    return values
                }

                function printRules(item) {
                    


                    var subRules = '(' + item.fieldsOperator + ' ' + printValues(item)
                    item.ruleArray.forEach(printSubRuels);
                    function printSubRuels(item) {
                        subRules = subRules + " and " + item.fieldsOperator + ' ' + printValues(item)
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
                    updateCustomRule(this.form).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        } else {
                            this.msgError(response.msg)
                        }
                    })
                } else {
                    addCustomRule(this.form).then(response => {
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
                            updateCustomRule(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess('修改成功')
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addCustomRule(this.form).then(response => {
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
                })
                */
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                var Ids = (row.id && [row.id]) || this.ids

                this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return delCustomRule( { 'ids': Ids })
                }).then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                }).catch(function () {
                })
            }
        }
    }
</script>
