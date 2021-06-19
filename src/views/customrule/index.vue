
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="编号" prop="id"><el-input
            v-model="queryParams.id"
            placeholder="请输入编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="规则名称" prop="name"><el-input
            v-model="queryParams.name"
            placeholder="请输入规则名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="规则内容" prop="content"><el-input
            v-model="queryParams.content"
            placeholder="请输入规则内容"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="执行动作" prop="action"><el-input
            v-model="queryParams.action"
            placeholder="请输入执行动作"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="状态" prop="status"><el-input
            v-model="queryParams.status"
            placeholder="请输入状态"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
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
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="编号"
            align="center"
            prop="id"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="规则名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="规则内容"
            align="center"
            prop="content"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="执行动作"
            align="center"
            prop="action"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          />
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

        <FileChoose ref="fileChoose" :dialog-form-visible="fileOpen" @confirm="getImgList" @close="fileClose" />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { delCustomRule, listCustomRule } from '@/api/customrule'
import FileChoose from '@/components/FileChoose'

export default {
  name: 'CustomRule',
  components: {
    FileChoose
  },
  data() {
    return {
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
        id: undefined,
        name: undefined,
        content: undefined,
        action: undefined,
        status: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { id:
                [
                  { required: true, message: '编号不能为空', trigger: 'blur' }
                ],
      name:
                [
                  { required: true, message: '规则名称不能为空', trigger: 'blur' }
                ],
      content:
                [
                  { required: true, message: '规则内容不能为空', trigger: 'blur' }
                ],
      action:
                [
                  { required: true, message: '执行动作不能为空', trigger: 'blur' }
                ]
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
        status: undefined
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
      this.$router.push({
        name: 'coustom_rule_edit',
        params: {
          id: -1
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id =
                row.id || this.ids
      this.$router.push({
        name: 'coustom_rule_edit',
        params: {
          id: id
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delCustomRule({ 'ids': Ids })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
