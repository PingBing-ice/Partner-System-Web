<template>
  <div id="addTeam">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamFrom.name"
            name="队伍名"
            label="队伍名"
            placeholder="队伍名"
            :rules="[{ required: true, message: '请填写队伍名' }]"
        />
        <van-field name="radio" label="状态">
          <template #input>
            <van-radio-group v-model="addTeamFrom.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-if="Number(addTeamFrom.status) === 2"
                   v-model="addTeamFrom.password"
                   type="password"
                   name="password"
                   label="队伍密码"
                   placeholder="密码"
                   :rules="[{ required: true, message: '请填写队伍密码' }]"
        />
        <van-field name="stepper" label="人员数量">
          <template #input>
            <van-stepper v-model="addTeamFrom.maxNum" min="2" max="20"/>
          </template>
        </van-field>
        <van-field
            v-model="result"
            is-link
            readonly
            name="datePicker"
            label="时间选择"
            placeholder="点击选择时间"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-date-picker @confirm="onConfirm" :min-date="minDate" @cancel="showPicker = false" />
        </van-popup>
        <van-field
            v-model="addTeamFrom.description"
            rows="3"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>

  </div>
</template>

<script setup>
import {ref} from "vue";
import myAxios from "../../plugins/myAxios";
import { showSuccessToast, showFailToast } from 'vant';
import {useRouter} from "vue-router";
import {formatDate} from "../../services/dataUtils";

const currentDate = ref();
const showPicker = ref(false);
const minDate = new Date();
const result = ref('');

const router = useRouter();
const initFromData = {
  "name": "",
  "description": "",
  "expireTime": "",
  "maxNum": 0,
  "password": "",
  "status": 0
}


const addTeamFrom = ref({...initFromData})
const onSubmit = async () => {
  const postData = {
    ...addTeamFrom.value,
    expireTime: result.value,
    status: Number(addTeamFrom.value.status)
  }
  const res = await myAxios.post('/partner/team/addTeam', postData);
  if (res?.code === 200) {
    showSuccessToast("添加成功")
    await router.push({
      path: "/team",
    })
  } else {
    showFailToast("添加失败")
  }
}

const onConfirm = ({ selectedValues }) => {
  result.value = selectedValues.join('-');
  showPicker.value = false;
};
const isShow = () => {
  showPicker.value = true;
}
</script>

<style scoped>

</style>
