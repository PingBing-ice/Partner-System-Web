<template>

  <div id="rec">
    <div class="r">
      <label v-for="i in may" class="card" :class="box===i?'card_border':''">
        <div class="jf">
          {{ i }} 积分
        </div>
        <div class="yan">
          {{ i / 10 }} 元
        </div>
        <input type="radio" v-model="box" :value="i">
      </label>
    </div>

    <div class="recTitle">
      支付方式
    </div>
    <div style="padding: 15px">
      <div class="zfb">
        <label class="zf" :class="zfBox?'card_border':''">
          <img :src="zfb" height="25" width="25" alt="">
          <div style="margin-left: 3px">
            支付宝
          </div>
          <input type="checkbox" v-model="zfBox" value="zfb">
        </label>
      </div>
    </div>
    <div style="width: 100%;display: flex;justify-content: center;align-items: center">
      <div class="login_but" style="width: 90%">
        <button class="login_but_an" @click="onSubmit">立即充值</button>
      </div>
    </div>
  </div>
  <van-dialog v-model:show="show" title="充值服务为测试版,需要充值请下载支付宝沙箱版" show-cancel-button confirmButtonText="确认充值" @confirm="toZFB">
    <img src="https://mdn.alipayobjects.com/sandboxsys/afts/img/sNRlRJ1iAXwAAAAAAAAAAAAADgSLAQBr/original" alt=""
         width="150" height="150"/>
    <div style="font-size: 15px;">账号: obsapg2287@sandbox.com</div>
    <div style="font-size: 15px;">密码: 111111</div>
    <div style="font-size: 15px;">支付密码: 111111</div>
  </van-dialog>
  <van-dialog v-model:show="isUrl" :title="'充值金额:'+box" show-cancel-button @confirm="toZFB">
    <qrcode-vue :value="url" :size="150" level="H"/>

    <!--    <img src="https://mdn.alipayobjects.com/sandboxsys/afts/img/sNRlRJ1iAXwAAAAAAAAAAAAADgSLAQBr/original"  alt="" width="150" height="150"/>-->
  </van-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {showToast} from "vant";
import QrcodeVue from 'qrcode.vue'
import myAxios from "@/config/myAxios";
import {response} from "@/plugins/request/dao/type";
import zfb from '@/assets/zfb.svg'
const may = [
  1, 10, 50, 100, 500
]
const box = ref(0);
const zfBox = ref(true);
const show = ref(false);
const url = ref<string>('');
const isUrl = ref<boolean>(false)
const onSubmit = async () => {
  if (zfBox.value) {
    if (box.value !== 0) {
      show.value = true;

      showToast({message: box.value, position: 'top'});

    } else {
      showToast({message: '请选择充值金额', position: 'top'});
    }

  } else {

  }

}
const toZFB = async () => {
  const res: response = await myAxios.get(`/zfb/pay/积分充值/${box.value / 10}/${box.value}`);
  if (res.code === 200) {
    url.value = res.data;
    isUrl.value = true;
  } else {
    showToast({message: '系统错误请重试', position: 'top'});
  }

  //
  // const a = document.createElement("a");
  // a.href =  "/zfb/pay/" + '积分充值/' + box.value / 10 + "/" + box.value;
  // a.click();
  // a.remove();
}
</script>

<style scoped>
.card {
  box-sizing: border-box;
  max-width: 110px;
  max-height: 127px;
  width: calc(40% - 35px);
  height: calc(40% + 25px);
  background: #ffff;
  box-shadow: 6px 2px 23px rgba(0, 0, 0, 0.22);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  margin-right: 2%;
  margin-bottom: 3%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  user-select: none;
  color: black;
  flex-direction: column;
}

.zf {
  height: 48px;
  width: 165px;
  display: flex;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  box-shadow: 6px 2px 23px rgba(0, 0, 0, 0.22);
}

input {
  display: none;
}

.card_border {
  border: 1px solid #8bdcfb;
  box-shadow: 0 3px 10px -1px #8bdcfb;
}

#rec {
  width: 100%;
  height: calc(100% - 100px);
  background-color: #fff;
}

.r {
  display: flex;
  width: auto;
  height: 40%;
  padding: 15px;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.recTitle {
  width: 100%;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  border-top: 1px solid #c9c9c9;
  padding-top: 10px;
  color: #999;
}

.yan {
  width: 70%;
  padding-top: 6px;
  border-top: 1px solid #c9c9c9;
  color: #ff5722;
  font-weight: bolder;

}

.jf {
  font-weight: bolder;
}

.zfb {
  height: 50px;
}
</style>