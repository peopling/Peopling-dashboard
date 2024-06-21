/* eslint-disable padded-blocks */
<template>
  <div class="app-container">
      <el-button
          type="success"
          icon="el-icon-plus"
          key="new-variable"
          title="Değişken oluştur"
          @click="createData()"
        > Yeni Değişken
      </el-button>
      <el-empty description="Bir değişken tanımlı değil" v-if="isEmpty"></el-empty>
    <el-table
      :data="list"
      style="width: 100%"
      v-loading="listLoading"
      v-if="!isEmpty"
      highlight-current-row>
      <el-table-column label="Operations" min-width="180">
        <template slot-scope="{row, $index}">
          <el-button
            icon="el-icon-edit"
            @click="setEditMode(row, $index)">
          </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="updateData(row, $index)">
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click="deleteRow(row, $index)">
          </el-button>
        </template>
      </el-table-column>

      <el-table-column min-width="150" label="variable" >
        <editable-cell
          :show-input="row.editMode"
          slot-scope="{row}"
          @change="onInputChangeForVariable(row)"
          editable-component="el-select"
          close-event="change"
          v-model="row.title">
          <el-tag
            size="medium"
            type="primary"
            slot="content">
            {{ row.title }}
          </el-tag>

          <template slot="edit-component-slot">
            <el-option
            v-for="item in variableOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
          </template>
        </editable-cell>
      </el-table-column>
      <el-table-column label="Detail" min-width="180" >
          <template slot-scope="{row, $index}">
             <el-button @click="handleUpdateDetails(row,$index)">Detay</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-el-draggable-dialog
      :before-close="handleClose"
      :visible.sync="dialogTableVisible"
      :title="tempVariableData.title + ' Detayı'">
        <el-tabs type="border-card" >
            <el-tab-pane v-for="(variable, index) in variblesTabList" :key="index" :label="variable.value">
                <el-button
                  v-if="variable.key === 'accounting-code-definition'"
                  type="success"
                  icon="el-icon-plus"
                  key="new-detail"
                  title="Değişken oluştur"
                  @click="addDetail()"> Ekle
                </el-button>
                <el-table
                  v-if="variable.key === 'accounting-code-definition'"
                  :data="tempVariableData.details"
                  v-loading="listLoading"
                  highlight-current-row>
                <el-table-column
                    label="Tipi"
                    prop="title"
                    align="center"
                    width="200">
                    <template slot-scope="{row}">
                        <el-select
                        v-model="row.title"
                        class="filter-item"
                        @change="onInputChangeForDetail(row)"
                        placeholder="Please select"
                      >
                        <el-option
                          v-for="item in subTypeList"
                          :key="item.title"
                          :label="item.title"
                          :value="item.title"
                        />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Değeri"
                    prop="value"
                    align="center"
                    width="200">
                    <template slot-scope="{row}">

                      <el-col :span="12"><el-input
                        v-model="row.value"
                        placeholder="Değeri"
                      /></el-col>
                        <el-col :span="12"> <el-tag size="mini" type="info"> {{row.type}}</el-tag></el-col>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Tipi"
                    prop="title"
                    align="center"
                    width="200">
                    <template slot-scope="{row, $index}">
                      <el-button
                        type="warning"
                        icon="el-icon-minus"
                        title="Değişken oluştur"
                        @click="removeDetail(row, $index)"
                      > Kaldır
                      </el-button>
                    </template>
                </el-table-column>
                </el-table>
                <el-form
                  v-loading="listLoading"
                  v-if="variable.key === 'variable-Parameter'"
                  ref="dataForm"
                  :model="parameterVariable"
                  label-position="left"
                  label-width="100px"
                  style="width: 400px; margin-left: 50px"
                >
                  <el-form-item
                    :label="$t('table.title')"
                    prop="title"
                    label-width="100"
                  >
                    <el-input v-model="parameterVariable.title" />
                  </el-form-item>
                  <el-form-item
                  :label="$t('table.variableGroup')"
                  prop="variableGroup"
                  label-width="100"
                >
                  <el-input v-model="parameterVariable.variableGroup" />
                </el-form-item>
                  <el-form-item
                    :label="$t('table.calculateType')"
                    prop="type"
                    label-width="100"
                  >
                    <el-input v-model="parameterVariable.type" />
                  </el-form-item>
                  <el-form-item
                    :label="$t('table.includeSgk')"
                    prop="includeSgk"
                    label-width="100">
                    <el-select
                      v-model="parameterVariable.includeSgk"
                      class="filter-item"
                      placeholder="Seçiniz"
                    >
                      <el-option
                        v-for="item in parameterStatusOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('table.isToWorkRate')"
                    prop="isToWorkRate"
                    label-width="100">
                    <el-select
                      v-model="parameterVariable.isToWorkRate"
                      class="filter-item"
                      placeholder="Seçiniz"
                    >
                      <el-option
                        v-for="item in parameterStatusOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                </el-form-item>
                 <el-form-item
                    :label="$t('table.anyRezerv')"
                    prop="anyRezerv"
                    label-width="100">
                    <el-select
                      v-model="parameterVariable.anyRezerv"
                      class="filter-item"
                      placeholder="Seçiniz"
                    >
                      <el-option
                        v-for="item in parameterStatusOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                </el-form-item>
                </el-form>
              </el-tab-pane>
        </el-tabs>
        <div
          slot="footer"
          class="dialog-footer"
          >
          <el-button @click="dialogTableVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            @click="saveData(tempVariableData)"
            type="primary"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EditableCell from './components/EditableCell.vue'
import { cloneDeep, forEach } from 'lodash'
import { getVariables, defaultVariableData, getVariable, updateVariable, createVariable, deleteVariable } from '@/api/variables'
import { IVariableData, Details } from '@/api/types'

@Component({
  name: 'variables',
  components: {
    EditableCell
  },
  watch: {
    list: {
      handler(data) {
        console.log('watch', data)
      },
      deep: true
    }
  }
})

// eslint-disable-next-line padded-blocks
export default class extends Vue {

  public list: IVariableData[] = []
  public details: Details[] = []
  private isEmpty = false
  private isEditing = false
  private editMode = false
  private isShowYear = false
  private dialogTableVisible = false
  private listLoading = true
  private listQuery = {
    key: undefined,
    year: undefined
  }

  private detailObject = { key: '', title: '', type: '', value: '' }

  private subTypeList = {}

  private yearList = this.years()
  private tempVariableData = defaultVariableData

 private variableOptions = [{ key: 'bare-salary', name: 'Çıplak Maaş' }]
 private valueTypeList = [
   { key: 'bare-salary', subKey: 'bare-salary-value', valueType: 'percent', title: 'Çıplak Maaş', tabGroup: 'variable-Parameter' },
   { key: 'bare-salary', subKey: 'employee-type', valueType: 'text', title: 'Personel Türü', tabGroup: 'accounting-code-definition' },
   { key: 'bare-salary', subKey: 'cost-center-group', valueType: 'text', title: 'Masraf Merkezi Grubu', tabGroup: 'accounting-code-definition' },
   { key: 'bare-salary', subKey: 'account-code', valueType: 'text', title: 'Hesap Kodu', tabGroup: 'accounting-code-definition' }
 ]

private emptyParameterVariable = {
  key: '',
  title: '',
  type: 'percent',
  includeSgk: '',
  isToWorkRate: '',
  anyRezerv: '',
  variableGroup: ''
}

 private parameterVariable = this.emptyParameterVariable

 private parameterStatusOptions = ['Evet', 'Hayır']

 private variblesTabList = [{ key: 'variable-Parameter', value: 'Parametreler' }, { key: 'accounting-code-definition', value: 'Muhasebe Kod Tanımı' }]

 private handleUpdateDetails(row: any, index: any) {
   console.log('handleUpdateDetails', row)
   this.tempVariableData = row

   row.key = this.variableOptions.filter(x => x.name === row.title)[0] !== undefined ? this.variableOptions.filter(x => x.name === row.title)[0].key : ''
   if (this.tempVariableData.key !== '') {
     this.subTypeList = this.valueTypeList.filter(e => e.key === row.key && e.tabGroup === 'accounting-code-definition')

     console.log('subTypeList', this.subTypeList)
     this.handleTab()
     this.dialogTableVisible = true
   } else {
     this.$message({
       message: 'Lütfen Değişkeni seçiniz',
       type: 'warning'
     })
     this.dialogTableVisible = false
   }
 }

 private handleTab() {
   this.parameterVariable = this.emptyParameterVariable

   const bareSalaryValueParameters = this.tempVariableData.details.filter(d => d.key === 'bare-salary-value')[0]
   console.log(bareSalaryValueParameters)

   if (bareSalaryValueParameters !== undefined) {
     this.parameterVariable.key = bareSalaryValueParameters.key
     this.parameterVariable.type = bareSalaryValueParameters.type
     this.parameterVariable.title = bareSalaryValueParameters.title
     this.parameterVariable.includeSgk = bareSalaryValueParameters.includeSgk ? 'Evet' : 'Hayır'
     this.parameterVariable.isToWorkRate = bareSalaryValueParameters.isToWorkRate ? 'Evet' : 'Hayır'
     this.parameterVariable.anyRezerv = bareSalaryValueParameters.anyRezerv ? 'Evet' : 'Hayır'
     this.parameterVariable.variableGroup = bareSalaryValueParameters.variableGroup || ''
   } else {
     this.tempVariableData.details.push({
       key: 'bare-salary-value',
       title: this.parameterVariable.title,
       type: this.parameterVariable.type,
       value: '',
       includeSgk: this.parameterVariable.includeSgk === 'Evet',
       isToWorkRate: this.parameterVariable.isToWorkRate === 'Evet',
       anyRezerv: this.parameterVariable.anyRezerv === 'Evet',
       variableGroup: this.parameterVariable.variableGroup
     })
   }
 }

 private addDetail() {
   console.log('addDetail', this.tempVariableData)
   this.detailObject = {} as Details
   this.tempVariableData.details.push(this.detailObject)
 }

 private removeDetail(row: any, index: any) {
   this.tempVariableData.details.splice(index, 1)
 }

 created() {
   this.getAllList()
 }

 onInputChangeForVariable(val: any) {
   val.key = this.variableOptions.filter(x => x.name === val.title)[0] !== undefined ? this.variableOptions.filter(x => x.name === val.title)[0].key : ''
   this.details.splice(0, this.details.length)
   this.details.push(this.detailObject)
   val.details = this.details
   this.isEditing = true
 }

 onInputChangeForDetail(val: any) {
   const valueType = this.valueTypeList.filter(x => x.title === val.title)[0] !== undefined ? this.valueTypeList.filter(x => x.title === val.title)[0] : { key: '', subKey: '', valueType: '', title: '' }
   val.key = valueType.subKey
   val.type = valueType.valueType
   this.isEditing = true
 }

 beforeMount() {
   window.addEventListener('beforeunload', this.preventNav)
   this.$once('hook:beforeDestroy', () => {
     window.removeEventListener('beforeunload', this.preventNav)
   })
 }

 private preventNav(event: any) {
   if (!this.isEditing) {
     return
   }
   event.preventDefault()
   event.returnValue = ''
 }

 handleClose(done: any) {
   this.$confirm('Are you sure to close this dialog?')
     .then(_ => {
       done()
     })
     .catch(_ => { console.log() })
 }

 private async getAllList() {
   this.listLoading = true
   const { data } = await getVariables(this.listQuery)
   console.log(data)
   this.list = data.items

   if (data.total === 0) {
     this.isEmpty = true
   }
   // Just to simulate the time of the request
   setTimeout(() => {
     this.listLoading = false
   }, 0.5 * 1000)
 }

 private async createData() {
   const variableData = defaultVariableData
   variableData.type = 'variable'
   // companyids de eklenmelı
   variableData.id = Math.round(Math.random() * 100) + 1024 // mock a id
   const { data } = await createVariable({ variable: variableData })

   this.list.unshift(data.variable)
   this.isEmpty = false
   this.$notify({
     title: 'success',
     message: 'Create Successfully',
     type: 'success',
     duration: 2000
   })
 }

 private async updateData(row: any, index: any) {
   row.editMode = false
   row.type = 'variable'
   row.key = this.variableOptions.filter(x => x.name === row.title)[0] !== undefined ? this.variableOptions.filter(x => x.name === row.title)[0].key : ''
   // companyids de eklenmelı
   console.log('Update', row)
   const { data } = await updateVariable(row.id, { variable: row })
   this.isEditing = false
   this.list.splice(index, 1, data.variable)
   this.$notify({
     title: 'Success',
     message: 'Update Successfully',
     type: 'success',
     duration: 2000
   })
 }

 private async saveData(row: any) {
   console.log('saveData', row)

   const { data } = await updateVariable(row.id, { variable: row })

   row.editMode = false
   this.isEditing = false
   this.dialogTableVisible = false

   this.$notify({
     title: 'Success',
     message: 'Update Successfully',
     type: 'success',
     duration: 2000
   })
 }

 private async deleteRow(row: { editMode: boolean, id : number }, index: any) {
   this.$confirm('Değişkeni kaldırmak istediğinden emin misin?', 'Uyarı', {
     confirmButtonText: 'Onayla',
     cancelButtonText: 'Iptal',
     type: 'warning'
   })
     .then(async() => {
       await deleteVariable(row.id)
       this.list.splice(index, 1)

       if (this.list.length === 0) {
         this.isEmpty = true
       }
       this.$message({
         type: 'success',
         message: 'Silindi!'
       })
     })
     .catch(err => { console.error(err) })
 }

 setEditMode(row: { editMode: boolean, key: string, title: string, year: string, id: number }, index: any) {
   this.isEditing = true
   row.editMode = true
 }

 mounted() {
   this.list = this.list.map((row: any) => {
     return {
       ...row,
       editMode: this.list.length === 0,
       isShowYear: row.key !== 'cost-center'
     }
   })
 }

 private years() {
   const year = new Date().getFullYear()
   return Array.from({ length: year - 1900 }, (value, index) => 1901 + index).reverse().map(x => { return x.toString() })
 }
}
</script>
