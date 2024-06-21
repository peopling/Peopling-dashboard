<template>
  <div class="app-container">
    <el-button>TEST</el-button>


     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getBudgets, defaultBudgetData, getBudget, updateBudget, createBudget, deleteBudget } from '@/api/budgets'
import { IBudgetData } from '@/api/types'

@Component({
  name: 'budget-managment'
})
export default class extends Vue {
  dialogFormVisible = true
}
</script>
