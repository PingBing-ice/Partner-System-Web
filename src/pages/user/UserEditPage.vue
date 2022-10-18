<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset v-if="editUser.editKey==='email' && currentValue===''">
      <!-- 通过 pattern 进行正则校验 -->
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
    <van-cell-group inset v-else-if="editUser.editKey==='description'">
      <!-- 通过 pattern 进行正则校验 -->
      <van-cell-group inset>
        <van-field
            v-model="editUser.currentValue"
            rows="1"
            required
            autosize
            :label="editUser.editName"
            type="textarea"
            placeholder="请输入描述"
        />
      </van-cell-group>
    </van-cell-group>
    <van-cell-group inset v-else>
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
import {Toast} from "vant";
import {getCurrentUser} from "../../services/users";


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
    Toast.fail("请输入内容");
    return;
  }
  const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!pattern.test(editUser.value.currentValue+'')) {
    Toast.fail("邮箱格式错误");
    return;
  }

  const response = await myAxios.post('/oss/sendBinDing', {
    email: editUser.value.currentValue
  });
  if (response.code === 200) {
    isTime.value = true;
    subValue.value = false;
    Toast.success("发送成功，请注意查收");
  }else {
    if (response.description) {
      subValue.value = false;
      Toast.fail(response.description)
    }
  }
  subValue.value = false;
}
const onSubmit = async () => {
  if (editUser.value.currentValue === ''||currentValue.value === editUser.value.currentValue) {
    Toast.fail("请输入内容");
    return;
  }
  const currentUser = await  getCurrentUser();
  if (!currentUser) {
    Toast.fail("用户未登录");
    return;
  }
  console.log(editUser.value.editKey)
  console.log(editUser.value.currentValue);
  const res = await myAxios.post("/api/user/update", {
    "id": currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
    "code": emailCode.value,
  });

  if (res.code === 200 && res.data > 0) {
    Toast.success('修改成功');
    router.back();
  }else {
    Toast.fail("修改失败");
  }
}
</script>

<style scoped>

</style>
