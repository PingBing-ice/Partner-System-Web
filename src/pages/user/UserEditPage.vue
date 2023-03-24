<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset v-if="editUser.editKey==='email' && currentValue===''">
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          required
          :placeholder="`请输入要绑定的邮箱:${editUser.editName}`"
          :label="editUser.editName"
      >
      </van-field>
      <van-field
          v-model="emailCode"
          center
          clearable
          required
          label="验证码"
          placeholder="请输入邮箱验证码"
      >
        <template #button>
          <van-button size="small"  v-if="isTime===false" @click="sendEmail" :loading="subValue"  loading-text="发送中..." type="primary">发送验证码</van-button>
          <van-count-down v-if="isTime===true" :time="time" format="ss" @finish="isTime = false"/>
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset v-else-if="editUser.editKey==='email' && currentValue!==''">
      <van-field  :label="editUser.editName" required :model-value="editUser.currentValue" readonly />
      <van-field v-model="updateEmail" label="修改邮箱"
                 :rules="[{ required: true, message: '请填写邮箱' }]"
                 required
                 :error-message="formatEmail"
                 placeholder="请输入要修改的邮箱" />
      <van-field
          v-model="emailCode"
          center
          required
          clearable
          label="验证码"
          placeholder="请输入邮箱验证码"
      >
        <template #button>
          <van-button size="small"  v-if="isTime===false" @click="sendEmail" :loading="subValue"  loading-text="发送中..." type="primary">发送验证码</van-button>
          <van-count-down v-if="isTime===true" :time="time" format="ss" @finish="isTime = false"/>
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset v-else-if="editUser.editKey==='profile'">
      <!-- 通过 pattern 进行正则校验 -->
      <van-cell-group inset>
        <van-field
            v-model="editUser.currentValue"
            required
            autosize
            maxlength="200"
            show-word-limit
            :label="editUser.editName"
            type="textarea"
            label-align="top"
            placeholder="请输入描述"
        />
      </van-cell-group>
    </van-cell-group>

    <van-radio-group v-model="editUser.currentValue" style="display: flex;justify-content: center;margin-bottom: 12px;margin-top: 22px" direction="horizontal" v-if="editUser.editKey==='gender'">
      <van-radio name="男" style="margin-right: 53px">男</van-radio>
      <van-radio name="女">女</van-radio>
    </van-radio-group>
    <van-radio-group v-model="editUser.currentValue" style="display: flex;justify-content: center;margin-bottom: 12px;margin-top: 22px" direction="horizontal" v-if="editUser.editKey==='status'">
      <van-radio name="公开" style="margin-right: 53px">公开</van-radio>
      <van-radio name="私密">私密</van-radio>
    </van-radio-group>
    <van-cell-group inset v-if="editUser.editKey!=='gender'&&editUser.editKey!=='email'&&editUser.editKey!=='profile'&&editUser.editKey!=='status'">
      <!-- 通过 pattern 进行正则校验 -->
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          required
          :placeholder="`请输入:${editUser.editName}`"
          :label="editUser.editName"
      >
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary"  native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watchEffect} from "vue";
import myAxios from "../../plugins/myAxios";
import { showSuccessToast, showFailToast } from 'vant';
  import store from "../../store";


const currentValue = ref();
const isTime = ref( false);
const time = ref( 60 * 1000);
const subValue = ref(false);
const route = useRoute()
const router = useRouter()
const emailCode = ref('')
const updateEmail = ref('')
const formatEmail = ref('')
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})
watchEffect(()=>{
  formatEmail.value =''
  if (updateEmail.value !== '') {
    const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!pattern.test(updateEmail.value)) {
      formatEmail.value ='邮箱格式错误'
    }
  }

})
onMounted(() => {
  currentValue.value = editUser.value.currentValue
})
const sendEmail =async () => {
  subValue.value = true;
  if (editUser.value.currentValue === ''||!editUser.value.currentValue) {
    showFailToast("请输入内容");
    return;
  }
  const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!pattern.test(editUser.value.currentValue+'')) {
    showFailToast("邮箱格式错误");
    return;
  }

  const response = await myAxios.post('/oss/sendBinDing', {
    email: editUser.value.currentValue
  });
  if (response.code === 200) {
    isTime.value = true;
    subValue.value = false;
    showSuccessToast("发送成功，请注意查收");
  }else {
    if (response.description) {
      subValue.value = false;
      showFailToast(response.description)
    }
  }
  subValue.value = false;
}
const onSubmit = async () => {
  if (editUser.value.currentValue === '') {
    showFailToast("请输入内容");
    return;
  }
  if (currentValue.value === editUser.value.currentValue) {
    showFailToast("内容重复请修改");
    return
  }
  if (!store.getters.getIsLogin) {
    showFailToast("未登录");
    router.back();
    return;
  }
  const currentUser =store.getters.getUser
  const res = await myAxios.post("/api/user/update", {
    "id": currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
    "code": emailCode.value,
  });

  if (res.code === 200 && res.data ) {
    store.commit("setUser",res.data)
    showSuccessToast('修改成功');
    router.back();
  }else {
    showFailToast("修改失败");
  }
}
</script>

<style scoped>

</style>
