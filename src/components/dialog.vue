<template>
  <div class="dialog">
    <el-dialog title="" 
      :visible.sync="dialogStatus" 
      custom-class="schedule-dialog"
      :close-on-click-modal="false" 
      :close-on-press-escape="false" 
      :lock-scroll="false" 
      :show-close="false">
      <h2>{{ title }}</h2>
      <p>{{ sub }}</p>
      <el-table :data="dialogData" class="table-wisroom table-wisroom-dialog" stripe>
        <el-table-column property="date" label="时间">
          <template slot-scope="scope">
            <span>{{ _dateFormat(scope.row.start_timestamp * 1000).substring(0, 16) + '-' + _dateFormat(scope.row.end_timestamp * 1000).substring(0, 16).split(' ')[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column property="name" label="课程">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.stage + '-' + (scope.row.unit ? scope.row.unit : '') + '-' + scope.row.sessionname }}</span> -->
            <span>{{ scope.row.sessionname }}</span>
          </template>
        </el-table-column>
        <el-table-column property="class_name" label="班级"></el-table-column>
        <el-table-column property="assistant_username" label="主教"></el-table-column>
      </el-table>
      <el-button @click="closeDialog" v-show="type === 'confirm'">取消</el-button>
      <el-button type="danger" @click="triggerConfirm" v-if="type === 'confirm'">确定</el-button>
      <el-button type="danger" @click="closeDialog" v-else>确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      gridData: [],
      dialogTableVisible: false
    }
  },
  props: ['title', 'sub', 'type', 'deleteAction'],
  methods: {
    closeDialog() {
      this.$store.dispatch('setDialogStatus', false)
    },
    triggerConfirm() {
      this.$emit('deleteAction', this.dialogData[0])
    }
  },
  computed: {
    ...mapState({
      tabActiveName: state => state.common.tabActiveName,
      dialogStatus: state => state.common.dialogStatus,
      dialogData: state => state.common.dialogData
    })
  }
}
</script>

<style>

</style>
