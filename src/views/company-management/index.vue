<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.companyname"
        :placeholder="$t('table.companyname')"
        style="width: 200px; padding-right: 15px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.address"
        :placeholder="$t('table.address')"
        style="width: 200px; padding-right: 15px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.vkn"
        :placeholder="$t('table.vkn')"
        style="width: 200px; padding-right: 15px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        :placeholder="$t('table.status')"
        clearable
        class="filter-item"
        style="width: 130px; padding-right: 15px"
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
        style="width: 140px; padding-right: 15px"
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
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('table.companyId')"
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
        :label="$t('table.logo')"
        width="90px"
        align="center"
      >
        <template slot-scope="{row}">
          <img
           width="40px"
           height="40px"
          :src= row.logoUrl
          class="sidebar-logo">
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.companyname')" width="180%">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.companyname
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.vkn')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vkn }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.address')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | companyStatusFilter">
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
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button
            v-if="row.status !== 'active'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 'active')"
          >
            {{ $t("table.active") }}
          </el-button>
          <el-button
            v-if="row.status !== 'passive'"
            size="mini"
            @click="handleModifyStatus(row, 'passive')"
          >
            {{ $t("table.passive") }}
          </el-button>
          <el-button
            v-if="row.status !== 'deleted' && row.status !== 'active' "
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempCompanyData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
       <el-form-item
          :label="$t('table.logoUrl')"
          prop="logoUrl"
          label-width="100"
        >
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item
          :label="$t('table.companyname')"
          prop="companyname"
          label-width="100"
        >
          <el-input v-model="tempCompanyData.companyname" />
        </el-form-item>

        <el-form-item
          :label="$t('table.vkn')"
          prop="expenseCenter"
          label-width="100"
        >
          <el-input v-model="tempCompanyData.vkn" />
        </el-form-item>
        <el-form-item
          :label="$t('table.address')"
          prop="address"
          label-width="100"
        >
          <el-input v-model="tempCompanyData.address" />
        </el-form-item>
        <el-form-item
          :label="$t('table.status')"
          prop="status"
          label-width="100"
        >
          <el-tag :type="tempCompanyData.status | companyStatusFilter">
            {{ tempCompanyData.status }}
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="tempCompanyData.status !== 'aktif'"
          size="mini"
          type="success"
          @click="handleModifyStatus(tempCompanyData, 'aktif')"
        >
          {{ $t("table.active") }}
        </el-button>
        <el-button
          v-if="tempCompanyData.status !== 'pasif'"
          size="mini"
          @click="handleModifyStatus(tempCompanyData, 'pasif')"
        >
          {{ $t("table.passive") }}
        </el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getCompanies, createCompany, updateCompany, defaultCompanyData } from '@/api/companies'
import { ICompanyData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

// TODO: uyarı ve excel colonlarının lang destegı ekle
// TODO: image yukleme cross orgin hatası var duzelt
@Component({
  name: 'company-management',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0
  private list: ICompanyData[] = []
  private total = 0
  private listLoading = true
  private showUpload = true
  private listQuery = {
    page: 1,
    limit: 20,
    vkn: undefined,
    status: undefined,
    companyname: undefined,
    address: undefined,
    sort: '+id'
  }

  public imageUrl = ''

  private sortOptions = [
    { label: 'Id artan', key: '+id' },
    { label: 'Id azalan', key: '-id' }
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
    companyname: [{ required: true, message: 'title is required', trigger: 'blur' }]
  }

  private downloadLoading = false
  private tempCompanyData = defaultCompanyData

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getCompanies(this.listQuery)
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

  private resettempCompanyData() {
    this.tempCompanyData = cloneDeep(defaultCompanyData)
  }

  private handleCreate() {
    this.resettempCompanyData()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.tempCompanyData.logoUrl = this.imageUrl
        const companyData = this.tempCompanyData

        companyData.id = Math.round(Math.random() * 100) + 1024 // mock a id
        const { data } = await createCompany({ company: companyData })
        this.list.unshift(data.company)
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
    this.tempCompanyData = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.tempCompanyData)

        tempData.logoUrl = this.imageUrl
        console.log(tempData.id, { company: tempData })
        const { data } = await updateCompany(tempData.id, { company: tempData })
        const index = this.list.findIndex(v => v.id === data.company.id)

        this.list.splice(index, 1, data.company)
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
    const tHeader = ['id', 'companyname', 'vkn', 'address', 'status']
    const filterVal = ['id', 'companyname', 'vkn', 'address', 'status']
    const data = formatJson(filterVal, this.list)
    exportJson2Excel(tHeader, data, 'table-list')
    this.downloadLoading = false
  }

  private handleAvatarSuccess(res: any, file: any) {
    console.log('handleAvatarSuccess', res, file)
    this.imageUrl = URL.createObjectURL(file.raw)
  }

  private beforeAvatarUpload(file: any) {
    console.log('beforeAvatarUpload', file)
    const isJPG = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
      this.$message.error('Avatar picture must be JPG format!')
    }
    if (!isLt2M) {
      this.$message.error('Avatar picture size can not exceed 2MB!')
    }
    return isJPG && isLt2M
  }
}
</script>
