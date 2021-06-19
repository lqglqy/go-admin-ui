<template>
  <dynamic-form
    ref="dynamic-form"
    v-model="data"
    style="width:80%"
    :descriptors="descriptors"
    :lang="lang"
  >
    <template slot="operations">
      <el-button @click="submitForm">Submit</el-button>
      <el-button type="primary" plain @click="resetFields">resetFields</el-button>
    </template>
  </dynamic-form>
</template>

<script>
import { addCustomRule, updateCustomRule, getCustomRule } from '@/api/customrule'
import DynamicForm from 'vue-dynamic-form-component'

export default {
  name: 'CustomRule',
  components: {
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
                enum: ['ip.src eq', 'ip.src in', 'ip.src ne', 'not ip.src in',
                  'http.host eq', 'http.host ne', 'http.host matches', 'not http.host matches',
                  'http.referer eq', 'http.referer ne', 'http.referer matches', 'not http.referer matches',
                  'http.user_agent eq', 'http.user_agent ne', 'http.user_agent matches', 'not http.user_agent matches',
                  'http.request.uri eq', 'http.request.uri ne', 'http.request.uri matches', 'not http.request.uri matches',
                  'http.request.uri.path eq', 'http.host ne', 'http.host matches', 'not http.host matches',
                  'http.request_method eq', 'http.request_method ne', 'http.request_method matches', 'not http.request_method matches',
                  'http.cookie eq', 'http.cookie ne', 'http.cookie matches', 'not http.cookie matches',
                  'http.x_forwarded_for eq', 'http.x_forwarded_for ne', 'http.x_forwarded_for matches', 'not http.x_forwarded_for matches',
                  'http.version eq', 'http.version ne', 'http.version matches', 'not http.version matches',
                  'http.request.body eq', 'http.request.body ne', 'http.request.body matches', 'not http.request.body matches'
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
                  { label: 'Request-Body正则不匹配', value: 'not http.request.body matches' }
                ]
              },
              values: { type: 'string', label: '匹配内容', required: true, message: '源ip列表请用空格分隔;' },
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
                      enum: ['ip.src eq', 'ip.src in', 'ip.src ne', 'not ip.src in',
                        // 'http.host eq','http.host ne','http.host contains','not http.host contains','http.host in','not http.host in','http.host matches','not http.host matches',
                        'http.host eq', 'http.host ne', 'http.host matches', 'not http.host matches',
                        'http.referer eq', 'http.referer ne', 'http.referer matches', 'not http.referer matches',
                        'http.user_agent eq', 'http.user_agent ne', 'http.user_agent matches', 'not http.user_agent matches',
                        'http.request.uri eq', 'http.request.uri ne', 'http.request.uri matches', 'not http.request.uri matches',
                        'http.request.uri.path eq', 'http.host ne', 'http.host matches', 'not http.host matches',
                        'http.request_method eq', 'http.request_method ne', 'http.request_method matches', 'not http.request_method matches',
                        'http.cookie eq', 'http.cookie ne', 'http.cookie matches', 'not http.cookie matches',
                        'http.x_forwarded_for eq', 'http.x_forwarded_for ne', 'http.x_forwarded_for matches', 'not http.x_forwarded_for matches',
                        'http.version eq', 'http.version ne', 'http.version matches', 'not http.version matches',
                        'http.request.body eq', 'http.request.body ne', 'http.request.body matches', 'not http.request.body matches'
                      ],
                      options: [
                        { label: 'ip等于', value: 'ip.src eq' },
                        { label: 'ip不等于', value: 'ip.src ne' },
                        { label: 'ip包含', value: 'ip.src in' },
                        { label: 'ip不包含', value: 'not ip.src in' },

                        // { label: 'Host包含', value: 'http.host contains' },
                        // { label: 'Host不包含', value: 'not http.host contains' },
                        // { label: 'Host包含列表', value: 'http.host in' },
                        // { label: 'Host不包含列表', value: 'not http.host in' },

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
                        { label: 'Request-Body正则不匹配', value: 'not http.request.body matches' }
                      ]
                    },
                    values: { type: 'string', label: '匹配内容', required: true, message: '源ip列表请用空格分隔;' }
                  }
                }
              }
            }
          }
        },
        action: {
          type: 'enum',
          required: true,
          enum: ['deny', 'allow', 'watch'],
          options: [
            { label: 'Deny', value: 'deny' },
            { label: 'Allow', value: 'allow' },
            { label: 'Watch', value: 'watch' }
          ]
        }
      },
      data: {},
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        content: undefined,
        action: undefined,
        status: undefined
      }
    }
  },
  created() {
    console.log('init')
    console.log(this.$refs)
    console.log(this.$refs['dynamic-form'])
    const id = this.$route.params.id
    if (id > 0) {
      this.form.id = id
    }
    console.log(this.$route)
    console.log(id)
    if (id > 0) {
      getCustomRule(id).then(response => {
        console.log(response.data)
        var data = response.data
        this.data.ruleName = data.name
        this.data.action = data.action
        String.prototype.trim = function(char, type) {
          if (char) {
            if (type === 'left') {
              return this.replace(new RegExp('^\\' + char + '+', 'g'), '')
            } else if (type === 'right') {
              return this.replace(new RegExp('\\' + char + '+$', 'g'), '')
            }
            return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')
          }
          return this.replace(/^\s+|\s+$/g, '')
        }
        function trimValue(value, oper) {
          var val = value
          if (oper === 'ip.src eq' ||
                    oper === 'ip.src ne') {
            val = val.trim()
          } else if (oper === 'ip.src in' ||
                        oper === 'not ip.src in') {
            val = val.trim('{', 'left')
            val = val.trim('}', 'right')
          } else {
            val = val.trim('"')
          }

          return val
        }
        var rules = data.content
        var ruleArray = rules.split('or')
        var orRuleArr = []
        for (let i = 0; i < ruleArray.length; i++) {
          var termStr = ruleArray[i].trim()
          console.log(termStr)
          termStr.match(/\((.+)\)/g)
          console.log(RegExp.$1)
          var orRuleTrim = RegExp.$1
          var subRuleArray = orRuleTrim.split('and')
          var andRuleArr = []
          for (let j = 0; j < subRuleArray.length; j++) {
            var segs = subRuleArray[j].trim().split(' ')
            var end = 2

            var oper = segs.slice(0, end).join(' ')
            var val = trimValue(segs.slice(end).join(' '), oper)
            console.log('oper:' + oper)
            console.log('val:' + val)

            var r = { fieldsOperator: oper, values: val }
            andRuleArr.push(r)
          }
          oper = andRuleArr[0].fieldsOperator
          val = trimValue(andRuleArr[0].values, oper)
          var subRules = { fieldsOperator: oper,
            values: val,
            ruleArray: andRuleArr.slice(1) }
          orRuleArr.push(subRules)
        }
        this.data.ruleArray = orRuleArr
      })
    }
    this.title = '修改自定义规则'
  },
  methods: {
    resetFields() {
      this.$refs['dynamic-form'].resetFields()
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.data)
      // this.$refs['dynamicform'].validate()
      var ruleName = this.data.ruleName
      var action = this.data.action
      var rules = ''
      var ruleCount = 0

      this.data.ruleArray.forEach(printRules)

      function printValues(item) {
        var values = item.values
        console.log(item.fieldsOperator)
        if (item.fieldsOperator === 'ip.src eq' ||
                item.fieldsOperator === 'ip.src ne') {
          console.log(values)
        } else if (item.fieldsOperator === 'ip.src in' ||
                item.fieldsOperator === 'not ip.src in') {
          values = '{' + values + '}'
        } else {
          values = '"' + values + '"'
        }

        return values
      }

      function printRules(item) {
        var subRules = '(' + item.fieldsOperator + ' ' + printValues(item)
        item.ruleArray.forEach(printSubRuels)
        function printSubRuels(item) {
          subRules = subRules + ' and ' + item.fieldsOperator + ' ' + printValues(item)
          // console.log("subRule:" + subRules+" Count:"+subCount)
        }
        subRules = subRules + ')'
        if (ruleCount !== 0) {
          rules = rules + ' or ' + subRules
        } else {
          rules = subRules
        }
        // console.log("rules:"+rules+" count:"+ruleCount)
        ruleCount++
      }
      console.log(rules)
      this.form.name = ruleName
      this.form.content = rules
      this.form.action = action
      this.form.status = '1'
      if (this.form.id !== undefined) {
        updateCustomRule(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.$router.push({
              name: 'custom_rule',
              params: {
              }
            })
          } else {
            this.msgError(response.msg)
          }
        })
      } else {
        addCustomRule(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('增加成功')
            this.$router.push({
              name: 'custom_rule',
              params: {
              }
            })
          } else {
            this.msgError(response.msg)
          }
        })
      }
    }
  }
}

</script>
