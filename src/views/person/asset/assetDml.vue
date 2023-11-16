<template>
  <div>
    <div v-if="query.companyId === ''">
      <div class="my-code">点击财务操作详情</div>
    </div>
    <div v-else>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="transformedData" highlight-current-row style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="fixVersion" label="版本" />
        <el-table-column :show-overflow-tooltip="true" prop="companyName" label="公司名" />
        <el-table-column :show-overflow-tooltip="true" prop="reportYear" label="年份" />
        <el-table-column :show-overflow-tooltip="true" prop="totalAssets" label="资产总额" />
        <el-table-column :show-overflow-tooltip="true" prop="totalEquity" label="所有者权益合计" />
        <el-table-column :show-overflow-tooltip="true" prop="totalSales" label="销售总额" />
        <el-table-column :show-overflow-tooltip="true" prop="totalProfit" label="利润总额" />
        <el-table-column :show-overflow-tooltip="true" prop="primeBusProfit" label="主营业务收入" />
        <el-table-column :show-overflow-tooltip="true" prop="retainedProfit" label="净利润" />
        <el-table-column :show-overflow-tooltip="true" prop="totalTax" label="纳税总额" />
        <el-table-column :show-overflow-tooltip="true" prop="totalLiability" label="负债总额" />
        <el-table-column :show-overflow-tooltip="true" prop="fixApp" label="是否应用" />
        <el-table-column :show-overflow-tooltip="true" prop="fixOwner" label="操作人" />
        <el-table-column :show-overflow-tooltip="true" prop="fixTime" label="操作时间" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button :type="getActionButtonType(scope.row.fixApp)" @click="applyButtonClick(scope.row)" :disabled="scope.row.fixApp !== '未应用'">应用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { apply, get } from '@/api/person/assetDetail'
import assetDetail from '@/api/person/assetDetail'
import CRUD, { presenter, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, label: null, value: null, dictSort: 999 }

export default {
  components: { pagination },
  cruds() {
    return [
      CRUD({ title: '财务操作详情', url: 'api/asset/detail', query: { companyId: '' },
        crudMethod: { ...assetDetail }
      })
    ]
  },
  mixins: [
    presenter(),
    header(),
    form(function() {
      return Object.assign(defaultForm)
    })],
  data() {
    return {
      dataDictionary: {
        fixVersion: {
          0: '原始值',
          1: '修改后'
        },
        fixApp: {
          9: '不应用',
          0: '未应用',
          1: '应用'
        }
      },
      permission: {
        add: ['admin', 'dict:add'],
        edit: ['admin', 'dict:edit'],
        del: ['admin', 'dict:del']
      }
    }
  },
  computed: {
    transformedData() {
      return this.crud.data.map(item => ({
        ...item,
        fixApp: this.dataDictionary.fixApp[item.fixApp] || item.fixApp,
        fixVersion: this.dataDictionary.fixVersion[item.fixVersion] || item.fixVersion
      }))
    }
  },
  methods: {
    getActionButtonType(fixApp) {
      if (fixApp === '应用') return 'success'
      if (fixApp === '未应用') return 'danger'
      if (fixApp === '不应用') return 'info'
    },
    async applyButtonClick(row) {
      // 处理应用按钮的点击事件
      try {
        await this.$confirm('是否应用该财务数据, 财务指标将被修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await apply(row)
        this.crud.toQuery()
        this.$message({
          type: 'success',
          message: '应用成功!'
        })
      } catch (error) {
        this.$message({
          type: 'info',
          message: '取消应用'
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
