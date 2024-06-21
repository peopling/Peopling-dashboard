<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('table.name')"
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
      <el-table-column :label="$t('table.name')" width="180%">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.username
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.password')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.name')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
            <el-table-column
        :label="$t('table.email')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.phone')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
            <el-table-column
        :label="$t('table.roles')"
        width="180px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ selectedRoleItems(row.roles) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | userStatusFilter">
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
        :model="tempUserData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          :label="$t('table.username')"
          prop="username"
          label-width="100"
        >
          <el-input v-model="tempUserData.name" />
        </el-form-item>
        <el-form-item
          :label="$t('table.name')"
          label-width="100"
        >
          <el-input v-model="tempUserData.username" />
        </el-form-item>

        <el-form-item
          :label="$t('table.password')"
          prop="password"
          label-width="100"
        >
          <el-input v-model="tempUserData.password" />
        </el-form-item>
         <el-form-item
          :label="$t('table.email')"
          prop="email"
          label-width="100"
        >
          <el-input v-model="tempUserData.email" />
        </el-form-item>
         <el-form-item
          :label="$t('table.phone')"
          prop="Number"
          label-width="100"
        >
          <el-input v-model="tempUserData.phone" />
        </el-form-item>
        <el-form-item
          :label="$t('table.roles')"
          prop="roles"
          label-width="100"
        >
        <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange">Hepsini Seç</el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="tempUserData.roles" @change="handleCheckedRolesChange">
            <el-checkbox v-for="role in roleList" :label="role.key" :key="role.key">{{role.name}}</el-checkbox>
        </el-checkbox-group>
        </el-form-item>

        <el-form-item
          :label="$t('table.status')"
          prop="status"
          label-width="100"
        >
          <el-tag :type="tempUserData.status | userStatusFilter">
            {{ tempUserData.status }}
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="tempUserData.status !== 'active'"
          size="mini"
          type="success"
          @click="handleModifyStatus(tempUserData, 'active')"
        >
          {{ $t("table.active") }}
        </el-button>
        <el-button
          v-if="tempUserData.status !== 'passive'"
          size="mini"
          @click="handleModifyStatus(tempUserData, 'passive')"
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

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getUsers, createUser, updateUser, defaultUserData } from '@/api/users'
import { getRoutes, getRoles, createRole, deleteRole, updateRole } from '@/api/roles'
import { IUserData, IRoleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'user-management',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0
  private list: IUserData[] = []
  private roles: IRoleData[] = []
  private total = 0
  private listLoading = true
  private showUpload = true
  private listQuery = {
    page: 1,
    limit: 20,
    status: undefined,
    name: undefined,
    sort: '+id'
  }

   private roleList = [{ key: '', name: '' }]

   private selectedRoles = ['']

      private checkAll = false
      private isIndeterminate = true

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
    name: [{ required: true, message: 'name is required', trigger: 'blur' }]
  }

  private downloadLoading = false
  private tempUserData = defaultUserData

  created() {
    this.getList()
    this.getRoles()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getUsers(this.listQuery)
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

  private async handleModifyStatus(row: any, status: string) {
    this.$message({
      message: 'Status Change Successfully',
      type: 'success'
    })
    row.status = status
    const tempData = Object.assign({}, row)
    const { data } = await updateUser(tempData.username, { user: tempData })
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

  private resettempUserData() {
    this.tempUserData = cloneDeep(defaultUserData)
  }

  private handleCreate() {
    this.resettempUserData()
    this.getRoles()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  toggleUpload() {
    this.showUpload = !this.showUpload
  }

  private selectedRoleItems(keys: [any]) {
    const roleStringList: string[] = []
    keys.forEach((key: any) => {
      roleStringList.push(this.roleList.filter(x => x.key === key)[0]?.name)
    })
    return roleStringList
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const userData = this.tempUserData
        userData.id = Math.round(Math.random() * 100) + 1024 // mock a id
        const { data } = await createUser({ user: userData })
        this.list.unshift(data.user)
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
    this.tempUserData = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.tempUserData)

        console.log(tempData.id, { user: tempData })
        const { data } = await updateUser(tempData.username, { user: tempData })
        const index = this.list.findIndex(v => v.id === data.user.id)

        this.list.splice(index, 1, data.user)
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

  private async getRoles() {
    const { data } = await getRoles({ /* Your params here */ })
    this.roleList = data.items

    this.selectedRoles = this.tempUserData.roles
  }

  private handleCheckAllChange(val: any) {
    this.tempUserData.roles = val ? this.roleList.map(x => x.key) : []
    this.isIndeterminate = false
  }

  private handleCheckedRolesChange(value: any) {
    const checkedCount = value.length

    this.checkAll = checkedCount === this.roleList.length
    console.log(this.checkAll)
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length
  }
}
</script>
