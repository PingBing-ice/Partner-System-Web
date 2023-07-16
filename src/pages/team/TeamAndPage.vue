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
          <van-date-picker @confirm="onConfirm" :min-date="minDate" @cancel="showPicker.value = false" />
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

<script setup lang="ts">
import {ref} from "vue";
import {showSuccessToast, showFailToast, showToast} from 'vant';
import {useRouter} from "vue-router";
import teamRequest from "@/plugins/request/teamRequest";

let showPicker = ref<boolean>(false);
const minDate = new Date();
const result = ref('');
const resultTime = ref<number>(0);

const router = useRouter();
const initFromData = {
  name: "",
  description: "",
  expireTime: "",
  maxNum: 0,
  password: "",
  status: 0
}


const addTeamFrom = ref({...initFromData})
const onSubmit = async () => {
  const postData = {
    ...addTeamFrom.value,
    expireTime: resultTime.value,
    status: Number(addTeamFrom.value.status)
  };
  const res=await teamRequest.add(postData)
  if (res?.code === 200) {
    showToast({message: '添加成功', position: 'top'});
    await router.push({
      path: "/team",
    })
  } else {
    showToast({message: '添加失败', position: 'top'});
  }
}

const onConfirm = ({ selectedValues }:any) => {
  const date = new Date(selectedValues);
  resultTime.value = date.getTime();
  result.value = selectedValues.join('-');
  showPicker.value = false;
};
const isShow = () => {
  showPicker.value = true;
}
</script>

<style >
.van-field__control:read-only {
  width: 100%;
}
</style>
