<template>
  <div class="w100 h100 detail">
    <panel-part height="100%" :loading="loading">
      <template slot="content">
        <div class="w100 h100 casedetail-content">
          <h1>{{ data.caseName || "-" }}</h1>
          <p class="date">
            {{ data.casehappenDate || "-" }}
          </p>
          <p v-html="data.caseContent" class="casedetail-descr">
            {{ data.caseContent }}
          </p>
        </div>
      </template>
    </panel-part>
    <van-icon
      name="arrow"
      class="back-icon"
      color="#00faff"
      size="1rem"
      @click="$emit('cancel')"
    />
  </div>
</template>
<script>
import PanelPart from "@/components/pub/PanelPart.vue";
import { getTypicalCaseDetail } from "@/utils/api";
import { dataIsNullNumber, dataIsNullObj } from "@/utils/tool";
export default {
  data() {
    return {
      data: {},
      loading: false
    };
  },
  components: {
    "panel-part": PanelPart
  },
  props: {
    recordKey: {
      type: String,
      default: ""
    }
  },
  computed: {},
  methods: {
    getDetail: function() {
      this.loading = true;
      getTypicalCaseDetail({
        key: this.recordKey
      }).then(res => {
        this.loading = false;
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullObj(res.data);
          this.data = JSON.parse(JSON.stringify(data));
        }
      });
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.detail {
  background: #1c273c;
  position: relative;
  .casedetail-content {
    padding: px2rem(50px) px2rem(300px);
    font-size: px2rem(50px);
    color: #33efff;
    overflow: auto;
    h1 {
      text-align: center;
    }
    .date {
      text-align: center;
      margin-bottom: px2rem(15px);
    }
    .casedetail-descr {
      p {
        text-align: justify;
      }
      img {
        display: block;
        margin: 0 auto;
        max-width: 90%;
      }
    }
  }
  .back-icon {
    position: absolute;
    bottom: px2rem(50px);
    right: px2rem(50px);
  }
}
</style>
