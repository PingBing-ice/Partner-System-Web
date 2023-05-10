<template>
  <div id="points">
    <div class="points_heard">
      <span style="flex: 1;display: flex;align-items: center;justify-content: center;">
        <div style="display: flex;flex-direction:column">
          <span class="ps">
            <div>{{ signList.length }}天</div>
            <div>本月签到</div>
          </span>

<!--          <span class="ps">-->
<!--            <div>0天</div>-->
<!--            <div>累计签到</div>-->
<!--          </span>-->
        </div>
      </span>
      <div class="dri">

      </div>
      <div style="display:flex;align-items: center;justify-content: center;flex: 1" @click="sign">
        <span class="xd">
          <em class="xd_txt">
            {{cheekSign?'以签到':'签到'}}
          </em>

        </span>
      </div>
    </div>

    <div class="points_cont" v-if="signList.length>0||is">
      <van-calendar
          :readonly="true"
          :row-height="58"
          :show-title="false"
          v-model="dates"
          type="multiple"
          :poppable="false"
          :show-confirm="false"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          :style="'height: 88%;position: absolute;right: 10px;left: 10px;border-radius: 20px;box-shadow: 0 0 1vw #3493f8;'"
      />

    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import recordRequest from "../../plugins/request/recordRequest";
import {showToast} from "vant";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

const date = new Date();
const dates = new Date(2023, 5, 10);
const fullYear = date.getFullYear();
const month = date.getMonth();
const minDate = new Date(fullYear, month, 1)
const maxDate = new Date(fullYear, month, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())
const signList = ref([])
const is = ref(false);
const cheekSign = ref(false);


onMounted(async () => {
  const resp = await recordRequest.mathSign();
  if (resp.code === 200 && resp.data) {
    signList.value = resp.data;
    is.value = true;
  }
  const res=await recordRequest.checkSign();
  if (res.code === 200&&res.data) {
    cheekSign.value = res.data;
  }
})
const sign = async () => {
  const resp = await recordRequest.sign();
  if (resp.code === 200) {
    showToast({
      message: '签到成功',
      position: 'top',
    });
    location.reload();
  }

}
const formatter = (day) => {
  const date = day.date;
  day.type = '';
  if (signList.value.length > 0) {
    for (let sign of signList.value) {
      const s = sign.split("-");
      if (parseInt(s[0]) === date.getFullYear() && parseInt(s[1]) === (date.getMonth() + 1) && parseInt(s[2]) === date.getDate()) {
        day.type = 'multiple-selected'
      }
    }
  }

  return day;
}

</script>

<style scoped>
#points {
  height: 100%;
  width: 100%;
  background: #ebf2f9;
  overflow: hidden;
}

.points_heard {
  display: flex;
  height: 25%;
  position: relative;
  width: 100%;
  background-image: linear-gradient(90deg, #3496f7 0%, #295ffd 100%);
}

.points_cont {
  height: 70%;
  width: 100%;
  position: absolute;
  bottom: 2px;
}

.ps {
  text-align: center;
  color: #eee;
  margin: 10px 0;
  font-size: 15px;
}

.xd {

  position: relative;

}

.xd:before {
  content: "";
  width: 82px;
  height: 82px;
  position: absolute;
  left: -11px;
  top: -11px;
  background: #bad7ff;
  border-radius: 100%;
  z-index: 2;
}

.xd:after {
  content: "";
  width: 105px;
  height: 105px;
  position: absolute;
  left: -22px;
  top: -22px;
  background: #5ab6fc;
  border-radius: 100%;
  z-index: 1;
  box-shadow: 0 0 5vw #fff;
}

.xd_txt {
  font-style: normal;
  width: 60px;
  height: 60px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  position: relative;
  z-index: 3;
  font-weight: bold;
  color: #2a63fc;
}

.dri {
  position: relative;
  top: 20%;
  width: 3px;
  height: 60%;
  border-radius: 100%;
  background-image: linear-gradient(rgb(0 0 0 / 0%), #fff, rgb(0 0 0 / 0%));
  opacity: .5;
}
</style>