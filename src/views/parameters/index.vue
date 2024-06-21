/* eslint-disable padded-blocks */
<template>
  <div class="app-container">
      <el-button
          type="success"
          icon="el-icon-plus"
          key="new-parameter"
          title="parametre oluştur"
          @click="createData()"
        > Yeni Parametre
      </el-button>
      <el-empty description="" v-if="isEmpty"></el-empty>
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

      <el-table-column min-width="150" label="parameter" >
        <editable-cell
          :show-input="row.editMode"
          slot-scope="{row}"
          @change="onInputChangeForParameter(row)"
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
            v-for="item in parameterOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
          </template>
        </editable-cell>
      </el-table-column>

      <el-table-column min-width="100" label="year">
        <editable-cell
          v-if="isShowYear || (row.key === 'sgk-parameter' || row.key === 'hourly-work')"
          :show-input="row.editMode"
          slot-scope="{row}"
          editable-component="el-select"
          close-event="change"
          v-model="row.year">
           <el-tag
           size="medium"
            type="primary"
            slot="content"> {{ row.year }}</el-tag>
          <template slot="edit-component-slot">
            <el-option
            v-for="item in yearList"
            :key="item"
            :label="item"
            :value="item"
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
      :title="tempParameterData.title + ' Detayı'">
        <el-table
          :data="tempParameterData.details"
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

               <el-col :span="12"><div></div><el-input
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
                title="parametre oluştur"
                @click="removeDetail(row, $index)"
              > Kaldır
              </el-button>
            </template>
        </el-table-column>
        </el-table>
        <div
        slot="footer"
        class="dialog-footer"
        >
        <el-button
              type="success"
              icon="el-icon-plus"
              key="new-detail"
              title="parametre oluştur"
              @click="addDetail()"
            > Ekle
        </el-button>
        <el-button @click="dialogTableVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          @click="saveData(tempParameterData)"
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
import { getParameters, defaultParameterData, getParameter, updateParameter, createParameter, deleteParameter } from '@/api/parameters'
import { IParameterData, Details } from '@/api/types'

@Component({
  name: 'parameters',
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

  public list: IParameterData[] = []
  public details: Details[] = []
  private isEmpty = false
  private isEditing = false
  private editMode = false
  private isShowYear = false
  private dialogTableVisible = false
  private total = 0
  private listLoading = true
  private listQuery = {
    key: undefined,
    year: undefined
  }

  private detailObject = { key: '', title: '', type: '', value: '' }

  private subTypeList = {}

  private yearList = this.years()
  private tempParameterData = defaultParameterData

 private parameterOptions = [{ key: 'sgk-parameter', name: 'sgk parametreleri' }, { key: 'cost-center', name: 'Masraf Merkezi' }, { key: 'hourly-work', name: 'Saatlik çalışma' }, { key: 'employee-type', name: 'Personel Türü' }]
 private valueTypeList = [
   { key: 'sgk-parameter', subKey: 'unemployment-rate', valueType: 'percent', title: 'işsizlik oranı' },
   { key: 'sgk-parameter', subKey: 'sgk-rate', valueType: 'percent', title: 'sgk oranı' },
   { key: 'sgk-parameter', subKey: 'sgk-ceiling-january', valueType: 'percent', title: 'sgk tavanı ocak' },
   { key: 'sgk-parameter', subKey: 'sgk-ceiling-july', valueType: 'percent', title: 'sgk tavanı temmuz' },
   { key: 'hourly-work', subKey: 'ocak', valueType: 'money', title: 'ocak' },
   { key: 'hourly-work', subKey: 'subat', valueType: 'money', title: 'şubat' },
   { key: 'hourly-work', subKey: 'mart', valueType: 'money', title: 'mart' },
   { key: 'hourly-work', subKey: 'nisan', valueType: 'money', title: 'nisan' },
   { key: 'hourly-work', subKey: 'mayis', valueType: 'money', title: 'mayıs' },
   { key: 'hourly-work', subKey: 'haziran', valueType: 'money', title: 'haziran' },
   { key: 'hourly-work', subKey: 'temmuz', valueType: 'money', title: 'temmuz' },
   { key: 'hourly-work', subKey: 'agustos', valueType: 'money', title: 'ağustos' },
   { key: 'hourly-work', subKey: 'eylul', valueType: 'money', title: 'eylül' },
   { key: 'hourly-work', subKey: 'ekim', valueType: 'money', title: 'ekim' },
   { key: 'hourly-work', subKey: 'kasim', valueType: 'money', title: 'kasım' },
   { key: 'hourly-work', subKey: 'aralık', valueType: 'money', title: 'aralık' },
   { key: 'cost-center', subKey: 'cost-center-no', valueType: 'text', title: 'Masraf Merkezi' },
   { key: 'cost-center', subKey: 'cost-center-group', valueType: 'text', title: 'Masraf Merkezi Grubu' },
   { key: 'employee-type', subKey: 'employee-type', valueType: 'text', title: 'Personel Türü' },
   { key: 'employee-type', subKey: 'employee-group', valueType: 'text', title: 'Personel Grubu' },
   { key: 'employee-type', subKey: 'employee-class', valueType: 'text', title: 'Personel Sınıfı' }
 ]

 private handleUpdateDetails(row: any, index: any) {
   console.log('handleUpdateDetails', row)
   this.tempParameterData = row

   row.key = this.parameterOptions.filter(x => x.name === row.title)[0] !== undefined ? this.parameterOptions.filter(x => x.name === row.title)[0].key : ''
   if (this.tempParameterData.key !== '') {
     this.subTypeList = this.valueTypeList.filter(e => e.key === row.key)

     console.log('subTypeList', this.subTypeList)
     this.dialogTableVisible = true
   } else {
     this.$message({
       message: 'Lütfen parametreyi seçiniz',
       type: 'warning'
     })
     this.dialogTableVisible = false
   }
 }

 private addDetail() {
   console.log('addDetail', this.tempParameterData)
   this.detailObject = {} as Details
   this.tempParameterData.details.push(this.detailObject)
 }

 private removeDetail(row: any, index: any) {
   this.tempParameterData.details.splice(index, 1)
 }

 created() {
   this.getAllList()
 }

 onInputChangeForParameter(val: any) {
   val.key = this.parameterOptions.filter(x => x.name === val.title)[0] !== undefined ? this.parameterOptions.filter(x => x.name === val.title)[0].key : ''
   this.details.splice(0, this.details.length)
   this.details.push(this.detailObject)
   val.details = this.details

   this.isEditing = true
   if (val.key === 'sgk-parameter' || val.key === 'hourly-work') {
     this.isShowYear = true
   } else {
     this.isShowYear = false
     val.year = ''
   }
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
   const { data } = await getParameters(this.listQuery)
   console.log(data)
   this.list = data.items
   this.total = data.total
   if (this.total === 0) {
     this.isEmpty = true
   }
   // Just to simulate the time of the request
   setTimeout(() => {
     this.listLoading = false
   }, 0.5 * 1000)
 }

 private async createData() {
   const parameterData = defaultParameterData
   parameterData.type = 'parameter'
   // companyids de eklenmelı
   parameterData.id = Math.round(Math.random() * 100) + 1024 // mock a id
   const { data } = await createParameter({ parameter: parameterData })

   this.list.unshift(data.parameter)
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
   row.type = 'parameter'
   row.key = this.parameterOptions.filter(x => x.name === row.title)[0] !== undefined ? this.parameterOptions.filter(x => x.name === row.title)[0].key : ''
   // companyids de eklenmelı
   console.log('Update', row)
   const { data } = await updateParameter(row.id, { parameter: row })
   this.isEditing = false
   this.list.splice(index, 1, data.parameter)
   this.$notify({
     title: 'Success',
     message: 'Update Successfully',
     type: 'success',
     duration: 2000
   })
 }

 private async saveData(row: any) {
   console.log('saveData', row)

   const { data } = await updateParameter(row.id, { parameter: row })

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
   this.$confirm('Parametreyi kaldırmak istediğinden emin misin?', 'Uyarı', {
     confirmButtonText: 'Onayla',
     cancelButtonText: 'Iptal',
     type: 'warning'
   })
     .then(async() => {
       await deleteParameter(row.id)
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
