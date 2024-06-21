<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('table.username')"
        style="width: 200px; padding-right: 15px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.salaryType"
        :placeholder="$t('table.salaryType')"
        clearable
        class="filter-item"
        style="width: 130px; padding-right: 15px;"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.displayName+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
            <el-select
        v-model="listQuery.status"
        :placeholder="$t('table.status')"
        clearable
        class="filter-item"
        style="width: 130px; padding-right: 15px;"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px; padding-right: 15px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="55"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.username')"
        width="180%"

      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.salary')"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.salary }} ₺</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.expenseCenter')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.expenseCenter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.employeeClass')"
        width="82px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.employeeClass }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.salaryType')"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.salaryType | salaryFilter}} </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | employeeStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="400"
        class-name="fixed-width"
      >
        <template slot-scope="{row, $index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="row.status!=='active'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'active')"
          >
            {{ $t('table.active') }}
          </el-button>
          <el-button
            v-if="row.status!=='passive'"
            size="mini"
            @click="handleModifyStatus(row,'passive')"
          >
            {{ $t('table.passive') }}
          </el-button>
          <el-button
            v-if="row.status!=='deleted' && row.status !== 'active'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempEmployeeData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('table.id')"
          prop="id"
        >
          <el-input v-model="tempEmployeeData.id" />
        </el-form-item>
                <el-form-item
          :label="$t('table.salaryType')"
          prop="salaryType"
        >
        <el-select
          v-model="tempEmployeeData.salaryType"
          class="filter-item"
          placeholder="Lütfen Seçim yapınız"
        >
          <el-option
            v-for="item in calendarTypeOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.username')"
          prop="username"
          label-width="100"
        >
          <el-input v-model="tempEmployeeData.username" />
        </el-form-item>

        <el-form-item
          :label="$t('table.expenseCenter')"
          prop="expenseCenter"
          label-width="100"
        >
          <el-input v-model="tempEmployeeData.expenseCenter" />
        </el-form-item>
        <el-form-item
            :label="$t('table.employeeClass')"
            prop="employeeClass"
            label-width="100"
          >
          <el-input v-model="tempEmployeeData.employeeClass" />
        </el-form-item>
        <el-form-item
          :label="$t('table.salary')"
          prop="salary"
          label-width="100"
        >  <el-badge > (₺) </el-badge>
           <el-input v-model="tempEmployeeData.salary" />
        </el-form-item>
        <el-form-item
          :label="$t('table.status')"
          prop="status"
          label-width="100"
        >
          <el-tag :type="tempEmployeeData.status | employeeStatusFilter">
            {{ tempEmployeeData.status }}
          </el-tag>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
            v-if="tempEmployeeData.status!=='active'"
            size="mini"
            type="success"
            @click="handleModifyStatus(tempEmployeeData,'active')"
          >
            {{ $t('table.active') }}
        </el-button>
        <el-button
            v-if="tempEmployeeData.status!=='active'"
            size="mini"
            @click="handleModifyStatus(tempEmployeeData,'passive')"
          >
            {{ $t('table.passive') }}
          </el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getEmployees, createEmployee, updateEmployee, defaultEmployeeData } from '@/api/employees'
import { IEmployeeData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

const calendarTypeOptions = [
  { key: 'HO', displayName: 'Saatlik' },
  { key: 'DY', displayName: 'Günlük' },
  { key: 'MO', displayName: 'Aylık' },
  { key: 'YE', displayName: 'Yıllık' }
]

// TODO: uyarı ve excel colonlarının lang destegı ekle

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc: { [key: string]: string }, cur) => {
  acc[cur.key] = cur.displayName
  return acc
}, {}) as { [key: string]: string }

@Component({
  name: 'employee-management',
  components: {
    Pagination
  },
  filters: {
    salaryFilter: (type: string) => {
      return calendarTypeKeyValue[type]
    }
  }
})
export default class extends Vue {
  private tableKey = 0
  private list: IEmployeeData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    status: undefined,
    username: undefined,
    salaryType: undefined,
    sort: '+id'
  }

  private calendarTypeOptions = calendarTypeOptions
  private sortOptions = [
    { label: 'Sicil No artan', key: '+id' },
    { label: 'Sicil No azalan', key: '-id' }
  ]

  private statusOptions = ['active', 'passive', 'deleted']
  private statusLangOptions = [this.$t('table.active'), this.$t('table.passive'), this.$t('table.deleted')]
  private dialogFormVisible = false
  private dialogStatus = ''
  private textMap = {
    update: 'Edit',
    create: 'Create'
  }

  private rules = {
    salaryType: [{ required: true, message: 'type is required', trigger: 'change' }],
    username: [{ required: true, message: 'title is required', trigger: 'blur' }]
  }

  private downloadLoading = false
  private tempEmployeeData = defaultEmployeeData

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getEmployees(this.listQuery)
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  private handleModifyStatus(row: any, status: string) {
    this.$message({
      message: 'Status Change Successfully',
      type: 'success'
    })
    row.status = status
  }

  private sortChange(data: any) {
    const { prop, order } = data
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }

  private getSortClass(key: string) {
    const sort = this.listQuery.sort
    return sort === `+${key}` ? 'ascending' : 'descending'
  }

  private resettempEmployeeData() {
    this.tempEmployeeData = cloneDeep(defaultEmployeeData)
  }

  private handleCreate() {
    this.resettempEmployeeData()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const employeeData = this.tempEmployeeData
        employeeData.id = Math.round(Math.random() * 100) + 1024 // mock a id
        const { data } = await createEmployee({ employee: employeeData })
        this.list.unshift(data.employee)
        this.dialogFormVisible = false
        this.$notify({
          title: 'success',
          message: 'Create Successfully',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private handleUpdate(row: any) {
    this.tempEmployeeData = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.tempEmployeeData)

        const { data } = await updateEmployee(tempData.id, { employee: tempData })
        const index = this.list.findIndex(v => v.id === data.employee.id)

        this.list.splice(index, 1, data.employee)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private handleDelete(row: any, index: number) {
    this.$notify({
      title: 'Success',
      message: 'Delete Successfully',
      type: 'success',
      duration: 2000
    })
    this.list.splice(index, 1)
  }

  private handleDownload() {
    this.downloadLoading = true
    const tHeader = ['id', 'username', 'salary', 'salaryType', 'expenseCenter', 'employeeClass', 'status']
    const filterVal = ['id', 'username', 'salary', 'salaryType', 'expenseCenter', 'employeeClass', 'status']
    const data = formatJson(filterVal, this.list)
    exportJson2Excel(tHeader, data, 'table-list')
    this.downloadLoading = false
  }
}
</script>
