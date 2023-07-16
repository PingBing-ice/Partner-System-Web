<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset v-if="editTeam.teamName==='状态'">
      <van-cell :title="editTeam.teamName">
        <template #right-icon>
          <van-checkbox-group v-model="checked" :max="2" direction="horizontal">
            <van-checkbox name="0">公开</van-checkbox>
            <van-checkbox name="1">私有</van-checkbox>
            <van-checkbox name="2">加密</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-cell>
      <van-field v-if="isPassword" v-model="password" type="password" label="密码" />
      <van-field v-if="isPassword" v-model="confirmPassword" type="password" label="确认密码" />
    </van-cell-group>
    <van-cell-group v-else inset>
      <van-field
          v-model="editTeam.teamValue"
          :name="editTeam.editKey"
          :placeholder="`请输入:${editTeam.teamName}`"
          :label="editTeam.teamName"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watchEffect} from "vue";
import myAxios from "../../config/myAxios";
import {showFailToast, showToast} from 'vant';


const checked = ref([])
const password = ref('');
const confirmPassword = ref('');
const isPassword = ref(false);
let isFor = '';
const  route=useRoute();
const  router=useRouter();
const editTeam=ref({
  teamID: route.query.teamID,
  teamValue:route.query.txt,
  teamName: route.query.teamName,
  editKey: route.query.editKey,
})

onMounted(() => {
   isFor =editTeam.value.teamValue
  if (editTeam.value.teamName === '状态') {
    checked.value[0] = editTeam.value.teamValue;
    if (checked.value[0] === '2') isPassword.value = true;
  }
})
watchEffect(()=>{
  if (checked.value.length === 2) {
    checked.value.splice(0,1 )
  }

  isPassword.value = checked.value[0] === '2';
})
const onSubmit = async () => {
  if (editTeam.value.teamName === '状态') {
    if (!checked.value || checked.value.length !== 1) {
      showFailToast("请修改值")
      return;
    }
    if (!password.value || password.value === '' || password.value !== confirmPassword.value) {
      showFailToast("密码错误");
      return;
    }
    const response =await myAxios.post('/team/update',{
      "id": editTeam.value.teamID,
      status: checked.value[0],
      password: password.value,
    });
    if (response.code === 200) {
      router.back();
      showToast({message: '修改成功', position: 'top'});

    }
  }else {
    if (isFor === editTeam.value.teamValue) {
      showFailToast("请修改值")
      return;
    }
    const response =await myAxios.post('/team/update',{
      "id": editTeam.value.teamID,
      [editTeam.value.editKey]: editTeam.value.teamValue,
    });
    if (response.code === 200) {
      router.back();
      showToast({message: '修改成功', position: 'top'});

    }
  }

}
</script>

<style scoped>

</style>