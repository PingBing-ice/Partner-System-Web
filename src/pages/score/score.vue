<template>
  <div id="score">
    <div class="scoreExh">
      <div class="scoreTitle">
        我的积分
      </div>
      <div class="scorePay">
        100
      </div>
    </div>
    <div class="scoreService">
      <div class="serviceTitle">
        钱包服务
      </div>
      <div class="scoreIcon">
        <div class="ic" @click="toRecharge">
          <img :src="cz" alt="">
          <div class="icon_title">
            积分充值
          </div>
        </div>
        <div class="ic">
          <img :src="dd" alt="">
          <div class="icon_title">
            订单管理
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import cz from '@/assets/cz.svg'
import dd from '@/assets/dd.svg'
const router = useRouter()
const toRecharge = () => {
  router.push({
    path: '/rec'
  })
}
</script>

<style scoped>
#score {
  width: 100%;
  height: calc(100% - 100px);
  background-color: #f8f8f8;
}

.scoreExh {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: auto;
  height: 20%;
  margin: 10px;
  border-radius: 13px;
  background-color: #029d94;
  text-align: center;
}

.scorePay {
  font-size: 30px;
  color: #eeeeee;
}

.scoreTitle {
  margin-top: 6px;
  font-size: 15px;
  color: #eeeeee;
}

.scoreService {
  width: auto;
  height: 30%;
  border-radius: 13px;
  background-color: #ffffff;
  margin: 16px 10px;
}

.serviceTitle {
  padding: 6px;
  border-bottom: 1px solid #f6f6f6;
  color: #888;
  font-size: 15px;
}

.scoreIcon {
  margin: 9px 0;
  display: flex;
  justify-content: space-around;
}

.ic {
  text-align: center;
}

.icon_title {
  font-size: 6px;
}
</style>