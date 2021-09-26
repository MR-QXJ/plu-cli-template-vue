<template>
  <div class="employee">
    <div
      class="employee-list"
      :style="{
        'min-height': `${$root.contentHeight - 54 * $root.ratePX}px`,
        height: `${$root.contentHeight - 54 * $root.ratePX}px`
      }"
    >
      <div :class="['flex', 'table', userlevel == 1 ? 'unit' : 'admin']">
        <div
          v-for="(item, index) in column"
          :key="index"
          class="table-th text-ellipsis"
        >
          {{ item }}
        </div>
      </div>
      <div class="w100 h100">
        <div>
          <van-list
            class="w100"
            :finished="noMore"
            finished-text="没有更多啦"
            v-model="loading"
            offset="200"
            @load="scroll"
            :style="{
              height: `${$root.contentHeight -
                (userlevel == 1 ? 156 : 122) * $root.ratePX}px`,
              'overflow-y': 'auto'
            }"
          >
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <div
                class="w100 h100"
                style="background:white; min-height: 180px"
              >
                <div :class="['table', userlevel == 1 ? 'unit' : 'admin']">
                  <div v-for="(item, index) in tableData" :key="index">
                    <div class="flex" @click="intoDetail(item.key)">
                      <div class="table-td text-ellipsis">
                        {{ item.name || "-" }}
                      </div>
                      <div class="table-td text-ellipsis">
                        {{ item.sexName || "-" }}
                      </div>
                      <div class="table-td text-ellipsis">
                        {{ item.dutyName || "-" }}
                      </div>
                      <div class="table-td text-ellipsis">
                        {{ item.phone || "-" }}
                      </div>
                      <div
                        class="table-td"
                        style="color:red"
                        @click.stop="handleEmployee(item)"
                        v-if="userlevel == 1"
                      >
                        删除
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-pull-refresh>
          </van-list>
        </div>
      </div>
    </div>
    <div class="w100 consult-btn-content">
      <van-button v-if="userlevel == 1" @click="handleAdd" square
        >添加</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  getEmployers,
  searchEmployeeByFire,
  deleteLoyeerData
} from "utils/api";
import { dataIsNullNumber, dataIsNullArray, dataIsNullStr } from "utils/tool";
export default {
  props: ["column", "unitId", "userlevel"],
  data() {
    return {
      refreshing: false,
      noMore: false,
      loading: false,
      params: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      tableData: []
    };
  },
  methods: {
    onRefresh() {
      this.$set(this.params, "pageNo", 1);
      this.$set(this.params, "total", 0);
      this.getEmployee();
    },
    getEmployee() {
      this.tableData = [];
      this.initEmployee();
    },
    scroll() {
      this.params.pageNo++;
      this.initEmployee();
    },
    intoDetail(key) {
      //从业人员表格点击
      const user = localStorage.getItem("identity");
      if (user == "adminManager") {
        //消防部门不可以进入
        return;
      }
      this.$router.push(
        `/employeeForm?isAdd=0&userId=${key}&unitId=${this.unitId}`
      );
    },
    // 添加
    handleAdd() {
      this.$router.push(`/employeeForm?isAdd=1&unitId=${this.unitId}`);
    },
    handleEmployee({ name, key }) {
      // 删除事件
      this.$dialog
        .confirm({
          message: "确定要删除【" + name + "】么？",
          showCancelButton: true
        })
        .then(() => {
          let params = [key];
          deleteLoyeerData(params).then(res => {
            const code = dataIsNullNumber(res.code);
            if (code === 0) {
              this.$toast.success("删除成功");
              this.getEmployee();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 初始化人员表格
    initEmployee() {
      let params = {
        key: this.unitId,
        pageNo: this.params.pageNo,
        pageSize: this.params.pageSize
      };
      let list = [];
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      const unitManage = () => {
        return new Promise(resolve => {
          getEmployers(params).then(res => {
            resolve(res);
          });
        });
      };
      const adminManage = () => {
        return new Promise(resolve => {
          searchEmployeeByFire(params).then(res => {
            resolve(res);
          });
        });
      };
      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          const code = dataIsNullNumber(res[0].code);
          if (code === 0) {
            const data = dataIsNullArray(res[0].data);
            data.map(item => {
              list.push(dataIsNullStr(item));
            });
          }
          this.tableData.push(...list);
          this.$set(this.params, "total", res[0].pageData.sumNum);
          this.noMore = this.params.total <= this.tableData.length;
          this.$toast.clear();
          this.refreshing = false;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.employee {
  background-color: #efeff4;
  /deep/ .van-button--normal {
    width: 100%;
    height: 49px;
    background-color: #14b9cc;
    color: #fff;
    font-size: 18px;
  }
  .employee-list {
    margin-top: 10px;
  }
  .van-list {
    background-color: #fff;
  }
  .table {
    padding-right: 10px;
    background: white;
  }
  .table-th,
  .table-td {
    line-height: 38px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }
  .table.unit .table-th:first-child,
  .table.unit .table-td:first-child {
    width: 20%;
  }
  .table.unit .table-th:nth-child(2),
  .table.unit .table-td:nth-child(2) {
    width: 10%;
  }
  .table.unit .table-th:nth-child(3),
  .table.unit .table-td:nth-child(3) {
    width: 30%;
  }
  .table.unit .table-th:nth-child(4),
  .table.unit .table-td:nth-child(4) {
    width: 30%;
  }
  .table.unit .table-th:nth-child(5),
  .table.unit .table-td:nth-child(5) {
    width: 10%;
  }
  .table.admin .table-th:first-child,
  .table.admin .table-td:first-child {
    width: 20%;
  }
  .table.admin .table-th:nth-child(2),
  .table.admin .table-td:nth-child(2) {
    width: 20%;
  }
  .table.admin .table-th:nth-child(3),
  .table.admin .table-td:nth-child(3) {
    width: 30%;
  }
  .table.admin .table-th:nth-child(4),
  .table.admin .table-td:nth-child(4) {
    width: 30%;
  }
  .long-width {
    width: 25%;
  }
  .normal-width {
    width: 20%;
  }
  .operation {
    width: 10%;
  }
  .btn-content {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .add-btn {
    width: 100% !important;
    color: #fff;
    background: #0aa1ed;
  }
  .no-data {
    text-align: center;
    font-size: 12px;
  }
  .consult-btn-content {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>
