<template>
  <div class="app-container">
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item label="公司id">
          <el-input v-model="form.companyId" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="公司名称" >
          <el-input v-model="form.companyName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="信用代码">
          <el-input v-model="form.uscd" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="form.reportYear" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="资产总额">
          <el-input v-model="form.totalAssets" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="所有者权益合计">
          <el-input v-model="form.totalEquity" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="销售总额">
          <el-input v-model="form.totalSales" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="利润总额">
          <el-input v-model="form.totalProfit" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="主营业务收入">
          <el-input v-model="form.primeBusProfit" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="净利润">
          <el-input v-model="form.retainedProfit" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="纳税总额">
          <el-input v-model="form.totalTax" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="负债总额">
          <el-input v-model="form.totalLiability" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!-- 字典列表 -->
    <el-card class="box-card">
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.companyName" clearable size="small" placeholder="输入公司名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <rrOperation />
        </div>
        <crudOperation :permission="permission" />
      </div>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%;" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">
        <el-table-column type="selection" width="55" />
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
        <el-table-column v-if="checkPer(['admin','dict:edit','dict:del'])" label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </el-card>

    <el-divider content-position="left">不会就找赫</el-divider>
      <!-- 财务详情列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>财务操作详记录</span>
      </div>
      <assetDml ref="assetDml" :permission="permission" />
    </el-card>

  </div>
</template>

<script>
import assetDml from './assetDml'
import crudAsset from '@/api/person/asset'
import CRUD, { presenter, header, form } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import udOperation from '@crud/UD.operation'

const defaultForm = { companyId: null, reportYear: null, uscd: null }

export default {
  name: 'Asset',
  components: { crudOperation, pagination, rrOperation, udOperation, assetDml },
  cruds() {
    return [
      CRUD({ title: '财务，默认应用', url: 'api/asset', crudMethod: { ...crudAsset }})
    ]
  },
  mixins: [presenter(), header(), form(defaultForm)],
  data() {
    return {
      queryTypeOptions: [
        { key: 'companyName', display_name: '公司名称' },
        { key: 'reportYear', display_name: '年份' }
      ],
      permission: {
        add: ['admin', 'asset:add'],
        edit: ['admin', 'asset:edit'],
        del: ['admin', 'asset:del']
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.assetDml) {
        this.$refs.assetDml.query.companyId = ''
      }
      return true
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      if (val) {
        this.$refs.assetDml.query.reportYear = val.reportYear
        this.$refs.assetDml.query.companyId = val.companyId
        this.$refs.assetDml.crud.toQuery()
      }
    },
    // 编辑前将字典明细临时清空，避免日志入库数据过长
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // 将角色的菜单清空，避免日志入库数据过长
      // form.dictDetails = null
    }
  }
}
</script>

<style scoped>
</style>
